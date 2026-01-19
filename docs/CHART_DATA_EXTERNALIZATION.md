# 图表数据外部化改进说明

## 📋 改进概述

本次修改优化了 AI 生成图表的数据处理方式，从**硬编码数据**改为**使用外部 JSON 文件**，提升了代码的可维护性和数据的可重用性。

## 🎯 主要改进

### 修改前（硬编码方式）
AI 生成的 HTML 文件中直接包含数据：

```html
<script>
  // 数据直接硬编码在 HTML 中
  const data = [
    { name: '1月', value: 12000 },
    { name: '2月', value: 19000 },
    // ... 更多数据
  ];
  
  // 使用数据渲染图表
  const option = {
    xAxis: { data: data.map(d => d.name) },
    series: [{ data: data.map(d => d.value) }]
  };
</script>
```

**问题**：
- ❌ 数据和代码耦合，难以维护
- ❌ 数据无法重用于其他图表
- ❌ 大数据量会导致 HTML 文件过大
- ❌ 修改数据需要重新生成整个 HTML

### 修改后（外部数据源）
AI 生成的 HTML 从外部 JSON 文件加载数据：

```html
<script>
  // 从外部 JSON 文件动态加载数据
  fetch('/generated-json/my-data.json')
    .then(response => response.json())
    .then(sourceData => {
      // sourceData 包含所有工作表数据
      const chartData = sourceData.Sheet1;
      
      // 使用数据渲染图表
      const option = {
        xAxis: { data: chartData.map(d => d.月份) },
        series: [{ data: chartData.map(d => d.销售额) }]
      };
      
      chart.setOption(option);
    })
    .catch(error => {
      console.error('数据加载失败:', error);
    });
</script>
```

**优势**：
- ✅ 数据和代码分离，易于维护
- ✅ 同一份数据可用于多个图表
- ✅ HTML 文件更小，加载更快
- ✅ 可以独立更新数据，无需重新生成 HTML
- ✅ 支持错误处理和加载状态

## 📝 修改的文件

### 1. `src/features/generated-chart/chat.tsx`

#### 修改位置 1：代码生成要求（167-186 行）

**修改内容**：
- 添加了数据加载方式的明确要求
- 强调禁止硬编码数据
- 要求使用 fetch API 加载外部 JSON

```typescript
## 代码生成要求
- 使用 HTML 单文件格式，包含完整的 HTML 结构
- **数据加载方式**：必须使用 fetch 从外部 JSON 文件加载数据，禁止在 HTML 中硬编码数据
- 使用内联 CSS 样式进行美化
- 使用 ECharts 通过 CDN 方式引入
// ... 其他要求
```

#### 修改位置 2：数据引用方式说明（206-251 行）

**新增内容**：
添加了详细的数据引用方式说明，包括：
- 禁止硬编码的明确声明
- JSON 文件路径说明
- 完整的示例代码
- 变量命名规范（使用 `sourceData`）

```typescript
## 数据引用方式（重要）
- **禁止硬编码数据**：不要将数据直接写在 HTML 中
- **使用外部数据源**：数据已保存在 `/generated-json/${name}.json` 文件中
- **数据加载方式**：必须使用 fetch API 从外部 JSON 文件加载数据
// ... 示例代码
```

## 🚀 使用示例

### 示例 1：基本用法

```javascript
// 加载数据并创建图表
fetch('/generated-json/sales-data.json')
  .then(response => response.json())
  .then(sourceData => {
    const data = sourceData.Sheet1;
    
    // 初始化图表
    const chart = echarts.init(document.getElementById('main'));
    chart.setOption({
      // 使用 data 配置图表
    });
  });
```

### 示例 2：多个工作表

```javascript
fetch('/generated-json/sales-data.json')
  .then(response => response.json())
  .then(sourceData => {
    // 访问不同工作表的数据
    const monthlyData = sourceData.Sheet1;
    const productData = sourceData.Sheet2;
    
    // 可以创建多个图表或组合数据
  });
```

### 示例 3：错误处理

```javascript
fetch('/generated-json/sales-data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(sourceData => {
    // 处理数据
  })
  .catch(error => {
    console.error('数据加载失败:', error);
    // 显示错误信息给用户
  });
```

## 📂 相关文件

### 新增文件

1. **`public/example-chart-with-external-data.html`**
   - 完整的示例 HTML 文件
   - 展示如何从外部 JSON 加载数据
   - 包含错误处理和加载状态

2. **`public/generated-json/example-data.json`**
   - 示例数据文件
   - 包含两个工作表的数据
   - 可以直接用于测试

### 测试方法

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问示例页面**：
   ```
   http://localhost:3000/example-chart-with-external-data.html
   ```

3. **测试 JSON API**：
   ```
   http://localhost:3000/test-json-api.html
   ```

4. **查看示例数据**：
   ```
   http://localhost:3000/generated-json/example-data.json
   ```

## 🎨 AI 生成的图表特点

现在 AI 会生成这样的 HTML：

1. **HTML 结构**：完整的 HTML5 文档结构
2. **样式**：内联 CSS，现代化设计
3. **数据加载**：使用 fetch API 从 `/generated-json/${filename}.json` 加载
4. **变量命名**：统一使用 `sourceData` 作为数据变量名
5. **错误处理**：包含数据加载失败的处理逻辑
6. **加载状态**：显示加载中和错误提示
7. **响应式**：自动适配不同屏幕尺寸
8. **交互性**：包含 tooltip、图例切换等交互功能

## 💡 最佳实践

### 1. 文件命名
- JSON 文件使用有意义的名称，如 `sales-2026.json`
- 避免使用特殊字符和中文

### 2. 数据结构
```json
{
  "Sheet1": [
    { "月份": "1月", "销售额": 12000 },
    { "月份": "2月", "销售额": 19000 }
  ],
  "Sheet2": [
    { "产品": "产品A", "销量": 320 }
  ]
}
```

### 3. 错误处理
- 始终包含 `.catch()` 处理错误
- 向用户显示友好的错误信息
- 记录详细的错误日志到控制台

### 4. 性能优化
- 对于大数据集，考虑分页或虚拟滚动
- 使用 ECharts 的 dataZoom 功能
- 合理设置图表的采样率

## 🔍 排查问题

### 问题 1：数据加载失败
**检查项**：
- JSON 文件是否存在于 `public/generated-json/` 目录
- 文件名是否正确（包括 `.json` 后缀）
- 开发服务器是否正在运行
- 浏览器控制台是否有 404 错误

### 问题 2：图表不显示
**检查项**：
- ECharts 库是否成功加载
- 容器元素是否有高度和宽度
- 数据格式是否正确
- 是否在数据加载完成后再初始化图表

### 问题 3：数据格式错误
**检查项**：
- JSON 格式是否有效
- 字段名称是否正确
- 数据类型是否匹配（数字 vs 字符串）

## 📊 数据流程

```
用户上传 Excel
    ↓
解析为 JSON
    ↓
保存到 /generated-json/
    ↓
AI 生成 HTML（包含 fetch 代码）
    ↓
浏览器加载 HTML
    ↓
fetch 请求 JSON 数据
    ↓
渲染图表
```

## 🎯 未来优化方向

1. **数据缓存**：缓存已加载的 JSON 数据
2. **懒加载**：大数据集按需加载
3. **数据更新**：支持数据实时更新
4. **版本控制**：JSON 文件版本管理
5. **压缩**：大文件自动压缩传输

## 📚 相关文档

- [JSON API 使用说明](./generated-json/README.md)
- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [Fetch API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

## ✅ 总结

这次改进实现了数据与代码的分离，使得：
- AI 生成的图表更加专业和可维护
- 数据可以被多个图表重用
- 用户可以独立更新数据而无需重新生成 HTML
- 系统整体架构更加清晰和合理

所有修改已完成，无 lint 错误，可以正常使用！🎉








