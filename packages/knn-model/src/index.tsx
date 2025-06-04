/**
 * Created by jiangzhixiong on 2025/01/18
 */

import React, { useEffect, useRef, useReducer } from 'react'
import { FC, useState } from 'react'
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as knnClassifier from '@jzx/knn-classifier';
import { Button, Flex, Image } from 'antd'
import { useThrottleFn } from 'ahooks';
import { isMobile } from './utils';
import './style.less'
import { TensorLike2D } from '@tensorflow/tfjs-core/dist/types';

import giveEgg from './assets/iloveyou.mov'
import gangsta from './assets/fku.mp3'
import middleFinger from './assets/youarebad.mp3'

import giveEggPic from './assets/baby.jpeg'
import gangstaPic from './assets/gangsta.webp'
import middleFingerPic from './assets/ybadbad.webp'

export interface IExample {
  label: string
  count: number
  data?: any[]
  similar: number
}

export interface CommonProps {
}

const componentName = "common"
let trainId: string | number = -1;
// K value for KNN
const TOPK = 3;
let mobilenet: mobilenetModule.MobileNet | null = null;
let classifier = knnClassifier.create();
const Common: FC<CommonProps> = (props) => {
  const {
  } = props
  const [, dispatch] = useReducer((state) => state + 1, 0)
  const [examples, setExamples] = useState<IExample[]>([   // 初始化数据样本集
    { label: 'normal', count: 0, similar: 0 },
    { label: 'gangsta', count: 0, similar: 0 },
    { label: 'middleFinger', count: 0, similar: 0 },
    { label: 'giveEgg', count: 0, similar: 0 },
  ])
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [voice, setVoice] = useState(false)  // 测试语音
  const [playingVoice, setPlayingVoice] = useState<string | undefined>(undefined)
  const [playingPic, setPlayingPic] = useState<string | undefined>(undefined)
  const voiceRef = useRef<HTMLAudioElement>()
  const { run: playVoice } = useThrottleFn(
    (_samples: IExample[]) => {
      const audioList = new Map([
        ['gangsta', gangsta],
        ['middleFinger', middleFinger],
        ['giveEgg', giveEgg],
      ])
      const picList = new Map([
        ['gangsta', gangstaPic],
        ['middleFinger', middleFingerPic],
        ['giveEgg', giveEggPic],
      ])

      if (voice && voiceRef.current) {
        let item = _samples.find((item) => item.similar > 0.6)

        if (!item) return
        voiceRef.current.src = audioList.get(item.label)
        !playingVoice && setPlayingVoice(item.label)
        !playingVoice && setPlayingPic(picList.get(item.label))
        voiceRef.current.onended = () => {
          setPlayingVoice(undefined)
          setPlayingPic(undefined)
        }
        playingVoice && voiceRef.current.play();  // 当前无播放中音频
      }
    },
    { wait: 2000 },
  );

  /**
   * Loads a the camera to be used in the demo
   */
  const setupCamera = async (config: { el: HTMLVideoElement, w?: number, h?: number }) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = config.el;
    video.width = config.w || 300;
    video.height = config.h|| 250 ;

    const mobile = isMobile();
    // ?------------ initial camera config -----------------
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: mobile ? undefined : video.width,
        height: mobile ? undefined : video.width,
      },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  const train = async (key: string | number) => {
    trainId = key
  }

  const loadModel = async (event) => {
    const file = event.target.files[0]; // 获取上传的第一个文件
    if (!file) {
      return;
    }

    const reader = new FileReader();

    // 文件读取成功时的回调
    reader.onload = function(e) {
      try {
        const fileContent = e?.target?.result; // 获取文件内容
        const jsonData = JSON.parse(fileContent); // 解析 JSON 数据
        let obj: { [x: string]: tf.Tensor2D; } = {}
        // 恢复训练数据和标签
        jsonData.forEach((item: { label: string | number; data: TensorLike2D; }) => {
          obj[item.label] = tf.tensor2d(item.data);
        });
        classifier.setClassifierDataset(obj);
      } catch (error) {
        alert('无法解析 JSON 文件: ' + error.message);
      }
    };

    // 读取文件内容
    reader.readAsText(file);
  }

  const saveModel = async () => {
    // save model
    const modelData = classifier.getClassifierDataset();
    console.log('modelData', modelData)

    // 遍历对象
    let dataArr = []
    for (const key in modelData) {
      const neighbor = modelData[key];
      const tensorArray = neighbor.arraySync();  // 将 Tensor2D 转换为数组
      dataArr.push({
        data: tensorArray, // 保存数据数组
        label: key // 保存标签
      });
    }
    const jsonData = JSON.stringify(dataArr);

    // 创建一个 Blob 对象，生成文件下载
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knn_model.json'; // 设置下载文件名
    a.click();
    // 释放 URL 对象
    URL.revokeObjectURL(url);
    // localStorage.setItem('modelData', JSON.stringify(jsonData))
  }

  async function animate() {
    if (!videoRef.current) return
    const image = tf.browser.fromPixels(videoRef.current);

    let logits;
    // 'conv_preds' is the logits activation of MobileNet.
    const infer = () => mobilenet?.infer(image, 'conv_preds');

    // Train class if one of the buttons is held down
    if (trainId != -1) {
      logits = infer();
      // Add current image to classifier
      classifier?.addExample(logits, trainId);
      // Reset the training bit so we only collect during clicks.
      trainId = -1;
    }

    // If the classifier has examples for any classes, make a prediction!
    const numClasses = classifier?.getNumClasses() || 0;
    if (numClasses > 0) {
      logits = infer();

      // predictions
      const res = await classifier?.predictClass(logits, TOPK);
      let newExamples = examples
      for (let i = 0; i < newExamples.length; i++) {
        const classExampleCount = classifier?.getClassExampleCount();
        for (const key in classExampleCount) {
          if (Object.prototype.hasOwnProperty.call(classExampleCount, key)) {
            if (newExamples[i].label === key) {
              newExamples[i].count = classExampleCount[key]
              newExamples[i].similar = res.confidences[key] * 100
            }
          }
        }
      }
      setExamples(newExamples)
      playVoice(newExamples)
      dispatch();  // 强制渲染
    }

    // ?------------ dispose the frame -----------------
    image.dispose();
    if (logits != null) {
      logits.dispose();
    }
    // Call this function again to keep predicting when the browser is ready.
    requestAnimationFrame(animate);
  }

  const initPage = async () => {
    let mob = await mobilenetModule.load()
    mobilenet = mob

    if (!mobilenet) return
    try {
      if (!videoRef.current) return
      const video = await setupCamera({
        el: videoRef.current,
      })
      video.play();
      animate();
      setLoading(false)
    } catch (e) {
      throw e;
    }
  }

  useEffect(() => {
    setLoading(true)
    initPage()
  }, [])

  return (
    <div className={componentName}>
      {loading && <div className={`${componentName}-loading`}>loading...</div>}
      <div className={`${componentName}-main`}>
        <div className={`${componentName}-cont`}>
          {playingPic && <Image rootClassName={`${componentName}-cont-pic`} preview={false} src={playingPic} width={150} height={120} />}
          <video
            ref={videoRef}
            playsInline
            style={{
              transform: 'scaleX(-1)',
            }}
          >
          </video>
        </div>
        <ul>
          {
            examples.map((item) => (
              <li key={item.label}>
                <Flex gap="middle">
                  <Button style={{ marginBottom: 8 }} onClick={() => train(item.label)}>喂投模型：{item.label}</Button>
                  <span style={{ marginBottom: 8 }}>样本数量：{item.count}</span>
                  <span style={{ marginBottom: 8 }}>相似度：{item.similar && item.similar.toFixed(2)} %</span>
                </Flex>
                </li>
            ))
          }
        </ul>
        <Flex gap={8} vertical className={`${componentName}-btns`}>
          {/* <!-- 文件上传控件 --> */}
          <label>
            <span>导入模型：</span>
            <input placeholder='引入文件' type="file" onChange={e => loadModel(e)} accept=".json" />
          </label>
          <Button type={voice ? "default" : "primary"} style={{ marginRight: 8 }} onClick={() => setVoice(pre => !pre)} >开始测试</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => saveModel()} >导出模型</Button>
        </Flex>
        <audio ref={voiceRef} crossOrigin="anonymous" />
      </div>
    </div>
  )
}

export default Common
