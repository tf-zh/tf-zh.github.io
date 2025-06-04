(self.webpackChunktensorflow_model=self.webpackChunktensorflow_model||[]).push([[56],{44589:function(g,r,e){"use strict";var f;e.r(r),e.d(r,{demos:function(){return T}});var h=e(90228),v=e.n(h),b=e(87999),_=e.n(b),E=e(75271),P=e(61228),k=e(85401),w=e(28620),p=e(31659),o=e(76212),O=e(10265),N=e(16670),x=e(33863),C=e(12833),T={"packages-knn-model-src-demo-src":{component:E.memo(E.lazy(function(){return e.e(433).then(e.bind(e,46917))})),asset:{type:"BLOCK",id:"packages-knn-model-src-demo-src",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(44143).Z},react:{type:"NPM",value:"18.3.1"},"@tensorflow-models/mobilenet":{type:"NPM",value:"2.1.0"},"@tensorflow/tfjs-core":{type:"NPM",value:"4.22.0"},"@tensorflow/tfjs-backend-cpu":{type:"NPM",value:"4.22.0"},"@tensorflow/tfjs-backend-webgl":{type:"NPM",value:"4.22.0"},"@jzx/knn-classifier":{type:"NPM",value:"0.1.5"},antd:{type:"NPM",value:"5.25.4"},ahooks:{type:"NPM",value:"3.8.5"},"./utils.ts":{type:"FILE",value:e(28419).Z},"./style.less":{type:"FILE",value:e(95930).Z}},entry:"index.tsx",title:"\u6A21\u578B\u8BAD\u7EC3"},context:{"./utils.ts":x,"./style.less":C,react:f||(f=e.t(E,2)),"@tensorflow-models/mobilenet":P,"@tensorflow/tfjs-core":k,"@tensorflow/tfjs-backend-cpu":w,"@tensorflow/tfjs-backend-webgl":p,"@jzx/knn-classifier":o,antd:O,ahooks:N,"/home/runner/work/tf-zh.github.io/tf-zh.github.io/packages/knn-model/src/utils/index.ts":x,"/home/runner/work/tf-zh.github.io/tf-zh.github.io/packages/knn-model/src/style.less":C},renderOpts:{compile:function(){var u=_()(v()().mark(function t(){var n,a=arguments;return v()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,e.e(708).then(e.bind(e,88708));case 2:return s.abrupt("return",(n=s.sent).default.apply(n,a));case 3:case"end":return s.stop()}},t)}));function i(){return u.apply(this,arguments)}return i}()}}}},76212:function(g,r,e){"use strict";e.r(r),e.d(r,{KNNClassifier:function(){return C},create:function(){return T},version:function(){return x}});var f=e(90228),h=e.n(f),v=e(87999),b=e.n(v),_=e(25298),E=e.n(_),P=e(17069),k=e.n(P),w=e(82092),p=e.n(w),o=e(85401);function O(u,i){return u==null&&i==null?null:u==null?i.clone():i===null?u.clone():o.concat([u,i],0)}function N(u,i){for(var t=[],n=0;n<u.length;n++)t.push({value:u[n],index:n});t.sort(function(d,m){return m.value-d.value});for(var a=new Float32Array(i),l=new Int32Array(i),s=0;s<i;s++)a[s]=t[s].value,l[s]=t[s].index;return{values:a,indices:l}}var x="1.2.5";var C=function(){function u(){E()(this,u),p()(this,"trainDatasetMatrix",void 0),p()(this,"classDatasetMatrices",{}),p()(this,"classExampleCount",{}),p()(this,"exampleShape",void 0),p()(this,"labelToClassId",{}),p()(this,"nextClassId",0)}return k()(u,[{key:"addExample",value:function(t,n){var a=this;if(this.exampleShape==null&&(this.exampleShape=t.shape),!o.util.arraysEqual(this.exampleShape,t.shape))throw new Error("Example shape provided, ".concat(t.shape," does not match ")+"previously provided example shapes ".concat(this.exampleShape,"."));this.clearTrainDatasetMatrix(),n in this.labelToClassId||(this.labelToClassId[n]=this.nextClassId++),o.tidy(function(){var l=a.normalizeVectorToUnitLength(o.reshape(t,[t.size])),s=l.shape[0];if(a.classDatasetMatrices[n]==null)a.classDatasetMatrices[n]=o.reshape(l,[1,s]);else{var d=o.concat([o.reshape(a.classDatasetMatrices[n],[a.classExampleCount[n],s]),o.reshape(l,[1,s])],0);a.classDatasetMatrices[n].dispose(),a.classDatasetMatrices[n]=d}o.keep(a.classDatasetMatrices[n]),a.classExampleCount[n]==null&&(a.classExampleCount[n]=0),a.classExampleCount[n]++})}},{key:"similarities",value:function(t){var n=this;return o.tidy(function(){var a=n.normalizeVectorToUnitLength(o.reshape(t,[t.size])),l=a.shape[0];if(n.trainDatasetMatrix==null){var s=null;for(var d in n.classDatasetMatrices)s=O(s,n.classDatasetMatrices[d]);n.trainDatasetMatrix=s}if(n.trainDatasetMatrix==null)return console.warn("Cannot predict without providing training examples."),null;o.keep(n.trainDatasetMatrix);var m=n.getNumExamples();return o.reshape(o.matMul(o.reshape(n.trainDatasetMatrix,[m,l]),o.reshape(a,[l,1])),[m])})}},{key:"predictClass",value:function(){var i=b()(h()().mark(function n(a){var l=this,s,d,m,y,M=arguments;return h()().wrap(function(c){for(;;)switch(c.prev=c.next){case 0:if(s=M.length>1&&M[1]!==void 0?M[1]:3,!(s<1)){c.next=3;break}throw new Error("Please provide a positive integer k value to predictClass.");case 3:if(this.getNumExamples()!==0){c.next=5;break}throw new Error("You have not added any examples to the KNN classifier. Please add examples before calling predictClass.");case 5:return d=o.tidy(function(){return o.cast(l.similarities(a),"float32")}),m=Math.min(s,this.getNumExamples()),c.t0=N,c.next=10,d.data();case 10:return c.t1=c.sent,c.t2=m,y=(0,c.t0)(c.t1,c.t2).indices,d.dispose(),c.abrupt("return",this.calculateTopClass(y,m));case 15:case"end":return c.stop()}},n,this)}));function t(n){return i.apply(this,arguments)}return t}()},{key:"clearClass",value:function(t){if(this.classDatasetMatrices[t]==null)throw new Error("Cannot clear invalid class ".concat(t));this.classDatasetMatrices[t].dispose(),delete this.classDatasetMatrices[t],delete this.classExampleCount[t],this.clearTrainDatasetMatrix()}},{key:"clearAllClasses",value:function(){for(var t in this.classDatasetMatrices)this.clearClass(t)}},{key:"getClassExampleCount",value:function(){return this.classExampleCount}},{key:"getClassifierDataset",value:function(){return this.classDatasetMatrices}},{key:"getNumClasses",value:function(){return Object.keys(this.classExampleCount).length}},{key:"setClassifierDataset",value:function(t){this.clearTrainDatasetMatrix(),this.classDatasetMatrices=t;for(var n in t)this.classExampleCount[n]=t[n].shape[0]}},{key:"calculateTopClass",value:function(t,n){var a,l={};if(t==null)return{classIndex:this.labelToClassId[a],label:a,confidences:l};var s={},d=0;for(var m in this.classDatasetMatrices)d+=this.classExampleCount[m],s[m]=d;var y={};for(var M in this.classDatasetMatrices)y[M]=0;for(var D=0;D<t.length;D++){var c=t[D];for(var A in this.classDatasetMatrices)if(c<s[A]){y[A]++;break}}var j=0;for(var R in this.classDatasetMatrices){var I=y[R]/n;I>j&&(j=I,a=R),l[R]=I}return{classIndex:this.labelToClassId[a],label:a,confidences:l}}},{key:"clearTrainDatasetMatrix",value:function(){this.trainDatasetMatrix!=null&&(this.trainDatasetMatrix.dispose(),this.trainDatasetMatrix=null)}},{key:"normalizeVectorToUnitLength",value:function(t){return o.tidy(function(){var n=o.norm(t);return o.div(t,n)})}},{key:"getNumExamples",value:function(){var t=0;for(var n in this.classDatasetMatrices)t+=this.classExampleCount[n];return t}},{key:"dispose",value:function(){this.clearTrainDatasetMatrix();for(var t in this.classDatasetMatrices)this.classDatasetMatrices[t].dispose()}}]),u}();function T(){return new C}},33863:function(g,r,e){"use strict";e.r(r),e.d(r,{isAndroid:function(){return f},isMobile:function(){return v},isiOS:function(){return h}});function f(){return/Android/i.test(navigator.userAgent)}function h(){return/iPhone|iPad|iPod/i.test(navigator.userAgent)}function v(){return f()||h()}},12833:function(g,r,e){"use strict";e.r(r)},71929:function(g,r,e){"use strict";e.r(r),e.d(r,{texts:function(){return f}});const f=[]},44143:function(g,r){"use strict";r.Z=`import React, { useEffect, useRef, useReducer } from 'react'
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
  const [examples, setExamples] = useState<IExample[]>([   // \u521D\u59CB\u5316\u6570\u636E\u6837\u672C\u96C6
    { label: 'normal', count: 0, similar: 0 },
    { label: 'gangsta', count: 0, similar: 0 },
    { label: 'middleFinger', count: 0, similar: 0 },
    { label: 'giveEgg', count: 0, similar: 0 },
  ])
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [voice, setVoice] = useState(false)  // \u6D4B\u8BD5\u8BED\u97F3
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
        playingVoice && voiceRef.current.play();  // \u5F53\u524D\u65E0\u64AD\u653E\u4E2D\u97F3\u9891
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
    const file = event.target.files[0]; // \u83B7\u53D6\u4E0A\u4F20\u7684\u7B2C\u4E00\u4E2A\u6587\u4EF6
    if (!file) {
      return;
    }

    const reader = new FileReader();

    // \u6587\u4EF6\u8BFB\u53D6\u6210\u529F\u65F6\u7684\u56DE\u8C03
    reader.onload = function(e) {
      try {
        const fileContent = e?.target?.result; // \u83B7\u53D6\u6587\u4EF6\u5185\u5BB9
        const jsonData = JSON.parse(fileContent); // \u89E3\u6790 JSON \u6570\u636E
        let obj: { [x: string]: tf.Tensor2D; } = {}
        // \u6062\u590D\u8BAD\u7EC3\u6570\u636E\u548C\u6807\u7B7E
        jsonData.forEach((item: { label: string | number; data: TensorLike2D; }) => {
          obj[item.label] = tf.tensor2d(item.data);
        });
        classifier.setClassifierDataset(obj);
      } catch (error) {
        alert('\u65E0\u6CD5\u89E3\u6790 JSON \u6587\u4EF6: ' + error.message);
      }
    };

    // \u8BFB\u53D6\u6587\u4EF6\u5185\u5BB9
    reader.readAsText(file);
  }

  const saveModel = async () => {
    // save model
    const modelData = classifier.getClassifierDataset();
    console.log('modelData', modelData)

    // \u904D\u5386\u5BF9\u8C61
    let dataArr = []
    for (const key in modelData) {
      const neighbor = modelData[key];
      const tensorArray = neighbor.arraySync();  // \u5C06 Tensor2D \u8F6C\u6362\u4E3A\u6570\u7EC4
      dataArr.push({
        data: tensorArray, // \u4FDD\u5B58\u6570\u636E\u6570\u7EC4
        label: key // \u4FDD\u5B58\u6807\u7B7E
      });
    }
    const jsonData = JSON.stringify(dataArr);

    // \u521B\u5EFA\u4E00\u4E2A Blob \u5BF9\u8C61\uFF0C\u751F\u6210\u6587\u4EF6\u4E0B\u8F7D
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knn_model.json'; // \u8BBE\u7F6E\u4E0B\u8F7D\u6587\u4EF6\u540D
    a.click();
    // \u91CA\u653E URL \u5BF9\u8C61
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
      dispatch();  // \u5F3A\u5236\u6E32\u67D3
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
      {loading && <div className={\`\${componentName}-loading\`}>loading...</div>}
      <div className={\`\${componentName}-main\`}>
        <div className={\`\${componentName}-cont\`}>
          {playingPic && <Image rootClassName={\`\${componentName}-cont-pic\`} preview={false} src={playingPic} width={150} height={120} />}
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
                  <Button style={{ marginBottom: 8 }} onClick={() => train(item.label)}>\u5582\u6295\u6A21\u578B\uFF1A{item.label}</Button>
                  <span style={{ marginBottom: 8 }}>\u6837\u672C\u6570\u91CF\uFF1A{item.count}</span>
                  <span style={{ marginBottom: 8 }}>\u76F8\u4F3C\u5EA6\uFF1A{item.similar && item.similar.toFixed(2)} %</span>
                </Flex>
                </li>
            ))
          }
        </ul>
        <Flex gap={8} vertical className={\`\${componentName}-btns\`}>
          {/* <!-- \u6587\u4EF6\u4E0A\u4F20\u63A7\u4EF6 --> */}
          <label>
            <span>\u5BFC\u5165\u6A21\u578B\uFF1A</span>
            <input placeholder='\u5F15\u5165\u6587\u4EF6' type="file" onChange={e => loadModel(e)} accept=".json" />
          </label>
          <Button type={voice ? "default" : "primary"} style={{ marginRight: 8 }} onClick={() => setVoice(pre => !pre)} >\u5F00\u59CB\u6D4B\u8BD5</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => saveModel()} >\u5BFC\u51FA\u6A21\u578B</Button>
        </Flex>
        <audio ref={voiceRef} crossOrigin="anonymous" />
      </div>
    </div>
  )
}

export default Common
`},95930:function(g,r){"use strict";r.Z=`.common {
  padding: 12px;
  position: relative;
  display: flex;
  text-align: center;
  justify-content: center;
  &-main {
    max-width: 640px;
    ul {
      list-style: none;
      padding-left: 0;
    }
    video {
      background-color: #000;
    }
  }
  &-cont {
    position: relative;
    background-color: #000;
    &-pic {
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: auto;
      z-index: 3;
    }
  }
}
.common-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.99);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
`},28419:function(g,r){"use strict";r.Z=`
export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
  return isAndroid() || isiOS();
}
`},18406:function(){},81587:function(){},21440:function(){}}]);
