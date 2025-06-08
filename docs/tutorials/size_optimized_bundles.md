---
title: 生成适合浏览器大小的软件包
toc: content
group:
  title: 部署和优化
  order: 5
---

## 概述  
TensorFlow.js 3.0 新增了对构建体积优化、面向生产的浏览器包的支持。换言之，我们希望让您更轻松地向浏览器传输更少的 JavaScript 代码。  

此功能主要面向有生产环境使用需求的用户——这类用户能从精简代码体积中获得显著收益（因此也愿意投入精力实现优化）。若要使用此功能，您需要熟悉 ES 模块、webpack 或 rollup 等 JavaScript 打包工具，以及 Tree Shaking/死代码消除等概念。  

本教程将演示如何创建一个自定义 TensorFlow.js 模块，该模块可与打包工具配合使用，从而为基于 TensorFlow.js 的程序生成体积优化的构建版本。  

## 术语  
在本文档中，我们将使用以下关键术语：  

ES 模块: 标准的 JavaScript 模块系统，于 ES6/ES2015 中引入。通过 `import` 和 `export` 语句来识别。  

打包（Bundling）: 将一组 JavaScript 资源合并/打包成一个或多个可在浏览器中使用的 JavaScript 资源。这通常是生成最终提供给浏览器的资源的步骤。应用程序通常会直接从转译后的库源代码进行自己的打包操作。常见的打包工具有 Rollup 和 Webpack。打包的最终结果称为“包”（bundle），如果被拆分成多个部分，有时也称为“块”（chunk）。  

Tree-Shaking: 死代码消除（Dead Code Elimination）——移除最终应用程序中未使用的代码。这通常在打包过程中完成，尤其是在代码压缩（minification）阶段进行。  

操作（Ops）: 对一个或多个张量执行数学运算并产生一个或多个张量作为输出的操作。Ops 属于“高级”代码，可以使用其他 ops 来定义其逻辑。  

内核（Kernel）: 与特定硬件能力绑定的 op 的具体实现。Kernels 属于“低级”代码，并且与后端相关。有些 ops 与 kernel 是一对一映射关系，而有些 ops 则会使用多个 kernels。  

## 适用范围与使用场景

### 仅推理图模型  

我们在此次发布中重点支持并听到的用户主要使用场景是：使用 TensorFlow.js 图模型进行推理。如果您正在使用 TensorFlow.js 的层模型（layers model），可以通过 tfjs-converter 将其转换为图模型格式。图模型格式在推理场景中效率更高。

通过 tfjs-core 进行底层张量操作 

我们支持的另一个使用场景是：直接使用 @tensorflow/tfjs-core 包进行底层张量操作的程序。

### 自定义构建方案的设计原则 

我们在设计此功能时的核心原则包括：

• 充分利用 JavaScript 模块系统（ESM），并允许 TensorFlow.js 的用户同样采用这一方式。  
• 使 TensorFlow.js 尽可能支持现有打包工具（如 webpack、rollup 等）的 Tree Shaking，从而让用户能够充分利用这些打包工具的所有功能，包括代码分割等特性。  
• 尽可能为对包体积不敏感的用户保持易用性。这也意味着，对于生产环境的构建，需要投入更多精力，因为我们库中的许多默认设置更偏向于易用性而非体积优化。  

我们工作流的主要目标是生成一个定制的JavaScript模块，该模块仅包含我们试图优化的程序所需的功能。我们依赖现有的打包工具来完成实际的优化工作。

虽然我们主要依赖JavaScript模块系统，但我们也提供了一个自定义的命令行工具（CLI），用于处理那些通过模块系统在用户代码中难以明确指定的部分。这方面的两个例子包括：

• 存储在 model.json 文件中的模型规范  
• 我们所使用的操作（op）到后端特定内核（backend-specific kernel）的分发系统  

这使得生成一个定制的 TensorFlow.js 构建版本比仅仅将打包工具指向常规的 @tensorflow/tfjs 包要复杂一些。

## 如何创建体积优化的定制包

### 步骤 1：确定你的程序使用了哪些内核  
这一步让我们能够根据你所选择的后端，确定你运行的任何模型或预处理/后处理代码所使用的所有内核。

使用 tf.profile 运行你应用中采用 TensorFlow.js 的部分，以获取内核信息。其输出结果大致如下：
```js
const profileInfo = await tf.profile(() => {
  // You must profile all uses of tf symbols.
  runAllMyTfjsCode();
});

const kernelNames = profileInfo.kernelNames
console.log(kernelNames);
```

将以下内核列表复制到剪贴板，以便进行下一步操作。
你需要使用与自定义打包中相同的后端来对代码进行性能分析。
如果你的模型或预处理/后处理代码发生变化，你需要重复此步骤。

### 步骤2：为自定义 tfjs 模块编写配置文件  

这里有一个示例配置文件。

它看起来是这样的：
```json
{
  "kernels": ["Reshape", "_FusedMatMul", "Identity"],
  "backends": [
      "cpu"
  ],
  "models": [
      "./model/model.json"
  ],
  "outputPath": "./custom_tfjs",
  "forwardModeOnly": true
}
```

kernels: 需要包含在打包文件中的内核列表。直接从第一步的输出结果中复制此内容。

backends: 你希望包含的后端类型列表。有效选项包括："cpu"、"webgl" 和 "wasm"。

models: 应用程序中加载的模型.json文件列表。如果程序未使用tfjs_converter加载图模型，则可留空。

outputPath: 用于存放生成模块的目标文件夹路径。

forwardModeOnly: 如果需要包含前述内核的梯度计算功能，请将此选项设为false。

### 步骤3：生成自定义tfjs模块  

使用配置文件作为参数运行自定义构建工具。你需要已安装@tensorflow/tfjs包才能使用该工具。

```js
npx tfjs-custom-module --config custom_tfjs_config.json  
```

这将在outputPath指定的路径下创建一个包含新文件的文件夹。

### 步骤4：配置打包工具，将tfjs别名为新的自定义模块  

在使用webpack、rollup等打包工具时，我们可以将原有对tfjs模块的引用路径替换为指向我们新生成的自定义tfjs模块。为实现最大化的包体积优化，需要为三个关键模块设置别名。

以下是webpack中的配置示例（完整示例详见此处）：
```js
config.resolve = {
  alias: {
    '@tensorflow/tfjs$':
        path.resolve(__dirname, './custom_tfjs/custom_tfjs.js'),
    '@tensorflow/tfjs-core$': path.resolve(
        __dirname, './custom_tfjs/custom_tfjs_core.js'),
    '@tensorflow/tfjs-core/dist/ops/ops_for_converter': path.resolve(
        __dirname, './custom_tfjs/custom_ops_for_converter.js'),
  }
}
```

```js
import alias from '@rollup/plugin-alias';

alias({
  entries: [
    {
      find: /@tensorflow\/tfjs$/,
      replacement: path.resolve(__dirname, './custom_tfjs/custom_tfjs.js'),
    },
    {
      find: /@tensorflow\/tfjs-core$/,
      replacement: path.resolve(__dirname, './custom_tfjs/custom_tfjs_core.js'),
    },
    {
      find: '@tensorflow/tfjs-core/dist/ops/ops_for_converter',
      replacement: path.resolve(__dirname, './custom_tfjs/custom_ops_for_converter.js'),
    },
  ],
}));
```

如果您的打包工具（bundler）不支持模块别名（module aliasing），则需要将导入语句修改为从第3步生成的 custom_tfjs.js 文件中导入 tensorflow.js。此时操作定义（op definitions）不会被 tree-shaking 移除，但内核（kernels）仍会被 tree-shaking 优化。通常来说，对内核进行 tree-shaking 能最大程度地减少最终打包文件的体积。

如果您仅使用了 @tensorflow/tfjs-core 这个包，则只需为该包设置别名即可。

### 步骤5：创建您的打包文件

运行您的打包工具（如 webpack 或 rollup）来生成打包文件。与未启用模块别名时相比，此时生成的打包文件体积应该会更小。您也可以使用类似 [此工具](https://webpack.github.io/analyse/) 的可视化工具来查看最终打包文件中包含了哪些内容。

### 步骤6：测试您的应用  

务必测试您的应用是否能够正常运行！
