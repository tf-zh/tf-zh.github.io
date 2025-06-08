---
title: 使用预训练模型
toc: content
group:
  title: 导入py模型
  order: 4
---

在本教程中，你将探索一个示例网页应用，该应用演示了如何使用 TensorFlow.js 的 Layers API 进行迁移学习。这个示例会加载一个预训练模型，然后在浏览器中对模型进行再训练。

该模型最初是在 Python 中基于 MNIST 手写数字分类数据集中的数字 0 到 4 进行预训练的。在浏览器中进行的再训练（或称为迁移学习）则使用了数字 5 到 9。这个示例展示了在迁移学习过程中，预训练模型的前几层可以用来从新数据中提取特征，从而加快在新数据上的训练速度。

本教程的示例应用已在线提供，因此你无需下载任何代码或设置开发环境。如果你希望本地运行代码，请完成“在本地运行示例”中的可选步骤。如果你不想设置开发环境，可以直接跳转到“探索示例”部分。

示例代码已在 [GitHub](https://github.com/tensorflow/tfjs-examples/tree/master/mnist-transfer-cnn) 上公开。

## 前提条件  

要在本地运行示例应用，你的开发环境需要安装以下工具：  

• Node.js（[下载](https://nodejs.org/)）  
• Yarn（[安装](https://yarnpkg.com/getting-started/install)）  

安装并运行示例应用  

1. 克隆或下载 `tfjs-examples` 代码仓库  

2. 进入 `mnist-transfer-cnn` 目录：  

```bash
cd tfjs-examples/mnist-transfer-cnn
```  

3. 安装依赖：  

```bash
yarn
```  

4. 启动开发服务器：  

```bash
yarn run watch
```  

## 探索示例  

打开示例应用。（若你在本地运行该示例，请在浏览器中访问 http://localhost:1234。）

你将看到一个标题为 MNIST 卷积神经网络迁移学习 的页面。按照说明尝试该应用。

以下是你可以尝试的几项操作：

• 尝试不同的训练模式，并比较损失值和准确率的变化。  
• 选择不同的位图示例，观察分类概率结果。注意：每个位图示例中的数字是表示图像像素的灰度整数值。  
• 直接编辑位图的整数值，观察分类概率如何随之变化。  

## 探索代码  
示例网页应用加载了一个已在MNIST数据集子集上预训练的模型。该预训练过程定义在Python程序`mnist_transfer_cnn.py`中。此Python程序不在本教程范围内，但若您想了解模型转换的示例，值得参考。  

`index.js`文件包含了演示的主要训练代码。当`index.js`在浏览器中运行时，`setup`函数（即`setupMnistTransferCNN`）会实例化并初始化`MnistTransferCNNPredictor`，该对象封装了再训练和预测流程。  

初始化方法`MnistTransferCNNPredictor.init`负责加载模型、加载再训练数据以及创建测试数据。以下是加载模型的代码行：  

```javascript
this.model = await loader.loadHostedPretrainedModel(urls.model);
```  

若查看`loader.loadHostedPretrainedModel`的定义，会发现它返回的是对`tf.loadLayersModel`的调用结果——这是TensorFlow.js用于加载由层（Layer）对象组成的模型的API。  

再训练逻辑定义在`MnistTransferCNNPredictor.retrainModel`中。如果用户选择了"冻结特征层"作为训练模式，则基础模型的前7层会被冻结，仅对最后5层使用新数据进行训练。若用户选择"重新初始化权重"，所有权重将被重置，此时应用实质上是从头开始训练模型。 

```js
if (trainingMode === 'freeze-feature-layers') {
  console.log('Freezing feature layers of the model.');
  for (let i = 0; i < 7; ++i) {
    this.model.layers[i].trainable = false;
  }
} else if (trainingMode === 'reinitialize-weights') {
  // Make a model with the same topology as before, but with re-initialized
  // weight values.
  const returnString = false;
  this.model = await tf.models.modelFromJSON({
    modelTopology: this.model.toJSON(null, returnString)
  });
}
```

该模型随后被编译，接着使用 model.fit() 方法在测试数据上进行训练。
```js
await this.model.fit(this.gte5TrainData.x, this.gte5TrainData.y, {
  batchSize: batchSize,
  epochs: epochs,
  validationData: [this.gte5TestData.x, this.gte5TestData.y],
  callbacks: [
    ui.getProgressBarCallbackConfig(epochs),
    tfVis.show.fitCallbacks(surfaceInfo, ['val_loss', 'val_acc'], {
      zoomToFit: true,
      zoomToFitAccuracy: true,
      height: 200,
      callbacks: ['onEpochEnd'],
    }),
  ]
});
```

若想了解 model.fit() 方法的参数详情，请参阅API文档。

在基于新数据集（数字5-9）完成训练后，即可使用该模型进行预测。MnistTransferCNNPredictor.predict 方法通过调用 model.predict() 来实现这一功能：

```js
// Perform prediction on the input image using the loaded model.
predict(imageText) {
  tf.tidy(() => {
    try {
      const image = util.textToImageArray(imageText, this.imageSize);
      const predictOut = this.model.predict(image);
      const winner = predictOut.argMax(1);

      ui.setPredictResults(predictOut.dataSync(), winner.dataSync()[0] + 5);
    } catch (e) {
      ui.setPredictError(e.message);
    }
  });
}
```

注意使用 `tf.tidy` 方法，它有助于防止内存泄漏。

## 了解更多  

本教程介绍了一个在浏览器中使用 TensorFlow.js 进行迁移学习的示例应用。查看以下资源，进一步了解预训练模型和迁移学习相关知识。

## TensorFlow.js  
• 将 Keras 模型导入 TensorFlow.js  
• 将 TensorFlow 模型导入 TensorFlow.js  
• TensorFlow.js 预置模型  


## TensorFlow Core  

• Keras：迁移学习与微调  
• 迁移学习与微调  
