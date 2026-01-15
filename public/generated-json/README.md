# JSON 数据保存 API 使用说明

这个功能允许你通过 API 保存 JSON 数据到 `public/generated-json` 目录，保存后的 JSON 文件可以直接通过 URL 访问。

## 📁 目录结构

```
public/
  └── generated-json/        # JSON 文件存储目录
      ├── example.json
      ├── data.json
      └── ...
```

## 🚀 API 端点

### 1. 创建/更新 JSON 文件

**端点**: `POST /api/json/create`

**请求体**:
```json
{
  "filename": "my-data",      // 文件名（会自动添加 .json 后缀）
  "data": {                   // 任意 JSON 数据
    "name": "张三",
    "age": 25,
    "hobbies": ["阅读", "游泳"]
  }
}
```

**响应**:
```json
{
  "success": true,
  "message": "JSON 文件创建成功",
  "filename": "my-data.json",
  "directPath": "/generated-json/my-data.json",
  "url": "http://localhost:3000/generated-json/my-data.json"
}
```

**示例代码**:
```javascript
// JavaScript/TypeScript
const response = await fetch('/api/json/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filename: 'user-profile',
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      settings: {
        theme: 'dark',
        language: 'zh-CN'
      }
    }
  }),
});

const result = await response.json();
console.log('文件访问地址:', result.url);
```

```python
# Python
import requests

response = requests.post('http://localhost:3000/api/json/create', json={
    'filename': 'user-profile',
    'data': {
        'username': 'john_doe',
        'email': 'john@example.com'
    }
})

result = response.json()
print('文件访问地址:', result['url'])
```

```bash
# cURL
curl -X POST http://localhost:3000/api/json/create \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "user-profile",
    "data": {
      "username": "john_doe",
      "email": "john@example.com"
    }
  }'
```

### 2. 列出所有 JSON 文件

**端点**: `GET /api/json/list`

**响应**:
```json
{
  "success": true,
  "files": [
    {
      "filename": "my-data.json",
      "directPath": "/generated-json/my-data.json",
      "url": "http://localhost:3000/generated-json/my-data.json",
      "size": 1024,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "modifiedAt": "2026-01-15T11:45:00.000Z"
    }
  ],
  "count": 1
}
```

**示例代码**:
```javascript
const response = await fetch('/api/json/list');
const result = await response.json();

result.files.forEach(file => {
  console.log(`文件: ${file.filename}`);
  console.log(`访问地址: ${file.url}`);
  console.log(`大小: ${(file.size / 1024).toFixed(2)} KB`);
});
```

### 3. 删除 JSON 文件

**端点**: `DELETE /api/json/delete`

**请求体**:
```json
{
  "filename": "my-data.json"
}
```

**响应**:
```json
{
  "success": true,
  "message": "JSON 文件删除成功",
  "filename": "my-data.json"
}
```

**示例代码**:
```javascript
const response = await fetch('/api/json/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filename: 'my-data.json'
  }),
});

const result = await response.json();
console.log(result.message);
```

## 🌐 直接访问

保存后的 JSON 文件可以直接通过浏览器访问：

```
http://localhost:3000/generated-json/your-file.json
```

或者在你的代码中：

```javascript
// 获取 JSON 数据
const data = await fetch('/generated-json/my-data.json').then(r => r.json());
console.log(data);
```

```html
<!-- 在 HTML 中使用 -->
<script>
  fetch('/generated-json/my-data.json')
    .then(response => response.json())
    .then(data => {
      console.log('数据:', data);
    });
</script>
```

## 🧪 测试工具

访问测试页面来测试这些 API：

```
http://localhost:3000/test-json-api.html
```

这个页面提供了一个友好的界面来：
- ✅ 创建和保存 JSON 文件
- 📋 列出所有已保存的文件
- 🗑️ 删除文件
- 🔗 直接访问文件链接

## ⚠️ 安全注意事项

1. **文件名验证**: API 会自动验证文件名，防止路径穿越攻击
2. **仅 JSON 格式**: 数据会被验证为有效的 JSON 格式
3. **公开访问**: 保存在 `public` 目录下的文件可以被公开访问，请勿保存敏感数据
4. **文件大小**: 建议不要保存过大的 JSON 文件（建议 < 10MB）

## 💡 使用场景

1. **导出数据**: 将应用中的数据导出为 JSON 文件供下载
2. **数据共享**: 生成可分享的 JSON 数据链接
3. **配置文件**: 动态生成配置文件
4. **API Mock**: 生成静态 JSON 文件用于前端开发
5. **数据快照**: 保存数据的某个时间点快照
6. **报表数据**: 生成图表所需的 JSON 数据文件

## 📝 React/Next.js 使用示例

```typescript
// 保存图表数据
const saveChartData = async (chartId: string, chartData: any) => {
  const response = await fetch('/api/json/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: `chart-${chartId}`,
      data: chartData,
    }),
  });

  const result = await response.json();
  
  if (result.success) {
    // 返回可访问的 URL
    return result.url;
  }
  
  throw new Error(result.error);
};

// 使用
const chartUrl = await saveChartData('sales-2026', {
  labels: ['一月', '二月', '三月'],
  datasets: [
    {
      label: '销售额',
      data: [12000, 19000, 15000]
    }
  ]
});

console.log('图表数据已保存:', chartUrl);
// 输出: http://localhost:3000/generated-json/chart-sales-2026.json
```

## 🔄 与现有功能集成

这个 JSON API 可以与你现有的功能配合使用：

```typescript
// 例如：在生成图表后保存数据
const handleGenerateChart = async () => {
  const chartData = generateChartData();
  
  // 保存 JSON 数据
  const jsonResponse = await fetch('/api/json/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: `chart-${Date.now()}`,
      data: chartData
    })
  });
  
  const jsonResult = await jsonResponse.json();
  
  // 现在你有了一个可以直接访问的 JSON 数据 URL
  console.log('数据 URL:', jsonResult.url);
};
```

## 🛠️ 故障排查

### 问题：文件创建失败
- 检查 JSON 数据格式是否正确
- 确保文件名不包含特殊字符（`/`, `\`, `..`）
- 查看服务器日志获取详细错误信息

### 问题：无法访问文件
- 确保文件已成功创建（调用 `/api/json/list` 检查）
- 检查文件路径是否正确
- 确保开发服务器正在运行

### 问题：文件不存在
- 文件保存在 `public/generated-json/` 目录
- 该目录会在首次使用时自动创建
- 可以手动检查文件系统确认文件是否存在

