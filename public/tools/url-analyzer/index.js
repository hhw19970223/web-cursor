// ==================== 数据处理工具 ====================

/**
 * 查找URL列
 * @param {Object} firstRow - 第一行数据
 * @returns {string|null} - URL列名
 */
function findUrlColumn(firstRow) {
  const urlKeywords = [
    "url",
    "URL",
    "Url",
    "网址",
    "链接",
    "地址",
    "提取页面url",
    "page_url",
    "pageUrl",
    "page-url",
    "link",
    "Link",
    "LINK",
    "website",
    "Website",
    "site",
  ];

  // 精确匹配
  for (const keyword of urlKeywords) {
    if (firstRow.hasOwnProperty(keyword)) {
      return keyword;
    }
  }

  // 模糊匹配
  const keys = Object.keys(firstRow);
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes("url") ||
      lowerKey.includes("link") ||
      lowerKey.includes("网址") ||
      lowerKey.includes("链接")
    ) {
      return key;
    }
  }

  return null;
}

/**
 * 显示错误弹窗
 * @param {string} message - 错误信息
 * @param {string} type - 错误类型 ('source' | 'history')
 */
function showError(message, type = "source") {
  alert("❌ " + message);

  // 根据类型重置不同的状态
  if (type === "source") {
    // 重置主文件上传状态
    document.getElementById("fileNameDisplay").textContent = "未选择文件";
    document.getElementById("fileInput").value = "";
    document.getElementById("startBtn").disabled = true;
  } else if (type === "history") {
    // 重置历史文件上传状态
    document.getElementById("historyFileNameDisplay").textContent =
      "未选择历史文件";
    document.getElementById("historyFileInput").value = "";
  }
}

// ==================== URL分析工具 ====================

/**
 * 提取域名
 * @param {string} url - URL地址
 * @returns {string} - 域名
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * 生成关键词
 * @param {string} url - URL地址
 * @returns {string} - 关键词列表
 */
function generateKeywords(url) {
  const domain = extractDomain(url).toLowerCase();
  const keywords = [];

  // 从域名提取关键词
  const parts = domain.split(".");
  keywords.push(...parts[0].split("-"));

  // 添加一些相关关键词
  if (domain.includes("shop") || domain.includes("store")) {
    keywords.push("ecommerce", "shopping");
  }
  if (domain.includes("tech") || domain.includes("dev")) {
    keywords.push("technology", "software");
  }

  return keywords.slice(0, 5).join(", ");
}

/**
 * 生成网站摘要
 * @param {string} url - URL地址
 * @param {string} keywords - 关键词
 * @returns {string} - 网站摘要
 */
function generateSummary(url, keywords) {
  const domain = extractDomain(url);
  return `${domain} 是一个专注于 ${
    keywords?.split(",")[0] || ""
  } 相关服务的网站，为用户提供优质的在线体验和专业服务。`;
}

/**
 * 行业分类
 * @param {string} url - URL地址
 * @param {string} keywords - 关键词
 * @param {string} title - 标题
 * @param {string} description - 描述
 * @param {Object} industryKeywords - 行业关键词映射
 * @returns {string} - 行业分类
 */
function classifyIndustry(url, keywords, title, description, industryKeywords) {
  const text = `${url} ${keywords} ${title} ${description}`.toLowerCase();

  let maxScore = 0;
  let detectedIndustry = "其他";

  for (const [industry, kws] of Object.entries(industryKeywords)) {
    let score = 0;
    for (const kw of kws) {
      if (text.includes(kw.toLowerCase())) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedIndustry = industry;
    }
  }

  return detectedIndustry;
}

/**
 * 风险评估
 * @param {string} url - URL地址
 * @param {string} keywords - 关键词
 * @param {string} title - 标题
 * @param {string} description - 描述
 * @param {Array} riskKeywords - 风险关键词列表
 * @returns {string} - 风险等级
 */
function assessRisk(url, keywords, title, description, riskKeywords) {
  const text = `${url} ${keywords} ${title} ${description}`.toLowerCase();

  let riskScore = 0;
  for (const kw of riskKeywords) {
    if (text.includes(kw.toLowerCase())) {
      riskScore++;
    }
  }

  if (riskScore >= 2) return "高风险";
  if (riskScore === 1) return "可疑";

  // 随机模拟一些风险（用于演示）
  const random = Math.random();
  if (random < 0.05) return "高风险";
  if (random < 0.15) return "可疑";
  return "安全";
}

// ==================== 数据导出工具 ====================

/**
 * 导出为XLSX格式
 * @param {Array} data - 数据数组
 * @param {string} filename - 文件名
 */
function exportToExcel(data, filename) {
  // 定义表头
  const headers = [
    "序号",
    "URL",
    "数量",
    "标题",
    "关键词",
    "描述",
    "网站摘要",
    "行业分类",
    "风险评估",
    "为什么",
    "h1",
    "h2",
    "h3",
  ];

  // 转换数据为二维数组
  const rows = data.map((row) => [
    row.index,
    row.url,
    row.count,
    row.title,
    row.keywords,
    row.description,
    row.summary,
    row.industry,
    row.risk,
    row.why,
    row.h1,
    row.h2,
    row.h3,
  ]);

  // 合并表头和数据
  const wsData = [headers, ...rows];

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // 设置列宽（根据内容自适应）
  const colWidths = [
    { wch: 6 }, // 序号
    { wch: 40 }, // URL
    { wch: 30 }, // 标题
    { wch: 25 }, // 关键词
    { wch: 40 }, // 描述
    { wch: 50 }, // 网站摘要
    { wch: 12 }, // 行业分类
    { wch: 10 }, // 风险评估
    { wch: 30 }, // 为什么
    { wch: 25 }, // h1
    { wch: 25 }, // h2
    { wch: 25 }, // h3
  ];
  ws["!cols"] = colWidths;

  // 设置表头样式（粗体、背景色）
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "URL分析报告");

  // 导出文件
  XLSX.writeFile(wb, filename);
}

// ==================== 日志工具 ====================

/**
 * 添加日志
 * @param {string} message - 日志信息
 * @param {string} type - 日志类型 (info/success/warning/error)
 */
function addLog(message, type = "info") {
  const container = document.getElementById("logContainer");
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = `log-entry log-${type}`;
  entry.textContent = `[${time}] ${message}`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;

  // 限制日志数量
  if (container.children.length > 100) {
    container.removeChild(container.firstChild);
  }
}

// ==================== 图表工具 ====================

/**
 * 初始化图表
 * @returns {Object} - 返回图表实例对象
 */
function initCharts() {
  const industryChart = echarts.init(document.getElementById("industryChart"));
  const riskChart = echarts.init(document.getElementById("riskChart"));

  const industryOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        data: [],
      },
    ],
  };

  const riskOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: ["安全", "可疑", "高风险", "未知"],
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 12 },
    },
    series: [
      {
        type: "bar",
        data: [0, 0, 0, 0],
        itemStyle: {
          color: (params) => {
            const colors = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"];
            return colors[params.dataIndex];
          },
          borderRadius: [10, 10, 0, 0],
        },
      },
    ],
  };

  industryChart.setOption(industryOption);
  riskChart.setOption(riskOption);

  // 响应式
  window.addEventListener("resize", () => {
    industryChart.resize();
    riskChart.resize();
  });

  return { industryChart, riskChart };
}

/**
 * 更新图表数据
 * @param {Object} charts - 图表实例对象
 * @param {Array} analyzedResults - 分析结果数组
 * @param {Array} selectedRisks - 选中的风险等级数组
 */
function updateCharts(charts, analyzedResults, selectedRisks = ['安全', '可疑', '高风险', '未知']) {
  // 根据选中的风险等级筛选数据
  const filteredResults = analyzedResults.filter(r => 
    selectedRisks.includes(r.risk)
  );

  // 行业分布 (使用过滤后的数据)
  const industryCount = {};
  filteredResults.forEach((result) => {
    industryCount[result.industry] = (industryCount[result.industry] || 0) + 1;
  });

  const industryData = Object.entries(industryCount).map(([name, value]) => ({
    name,
    value,
  }));

  charts.industryChart.setOption({
    series: [{ data: industryData }],
  });

  // 风险分布 (始终显示全部数据)
  const riskCount = { 安全: 0, 可疑: 0, 高风险: 0, 未知: 0 };
  analyzedResults.forEach((result) => {
    riskCount[result.risk] = (riskCount[result.risk] || 0) + 1;
  });

  charts.riskChart.setOption({
    series: [{ data: Object.values(riskCount) }],
  });
}

//         // 模拟URL分析
//         async function analyzeUrl(url, index, count = 1) {
//             // 模拟网络请求延迟
//             await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

//             // 模拟提取数据
//             const domain = extractDomain(url);
//             let title = ``;
//             let keywords = '';
//             let description = `这是 ${domain} 的网站描述，提供各种服务...`;
//             let h1 = '';
//             let h2 = '';
//             let h3 = '';
//             let flag = false;

//             let summary = '';
//             let industry = '';
//             let risk = '未知';

//             const text = `请分析以下网站信息并返回JSON格式的分析结果：

// 网站URL: ${url}

// 请完成以下任务：
// 1. 访问并分析该网站的内容和特征，并且记录下网站头部信息的title，keywords和description
// 2. 根据提供的标题、关键词和描述，生成一句话的网站总结（100字以内）
// 3. 判断网站所属行业类别（从以下选项中选择最合适的一个）：电子商务、金融服务、科技/IT、教育培训、医疗健康、房地产、汽车、媒体/娱乐、社交网络、餐饮美食、旅游、企业服务、赌博、其他
// 4. 评估网站风险等级，判断是否涉及色情、赌博或其他灰色产业，风险等级分为：高风险、可疑、安全
// 5. 说明风险评估的具体原因
// 6. 帮我生成以下固定格式的json数据

// **important**: 请不要使用CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2工具

// **重要：请严格按照以下JSON格式，不要包含任何其他文字说明：**

// {
//   "summary": "对网站的总结描述（100字以内）",
//   "industry": "所属行业分类",
//   "risk": "风险等级（高风险/可疑/安全）",
//   "why": "风险评估等级的原因说明"，
//   "description": "网站描述"
//   "keywords": "关键词"
//   "title": "标题"
// }`

//             try {
//                 const stream = await cursorMessageStream({
//                     prompt: text,
//                 });

//                 let result = await stream.wait(); // 阻塞

//                 if (!result) {
//                     const stream = await cursorMessageStream({
//                         prompt: text,
//                     });
//                     result = await stream.wait(); // 阻塞
//                     if (!result) {
//                         const stream = await cursorMessageStream({
//                             prompt: text,
//                         });
//                         result = await stream.wait(); // 阻塞
//                     }
//                 }

//                 try {
//                     const json = JSON.parse(result.code);
//                     summary = json.summary || '';
//                     industry = json.industry || '';
//                     risk = json.risk || '';
//                     why = json.why || '';
//                     description = json.description || '';
//                     keywords = json.keywords || '';
//                     title = json.title || '';
//                     flag = true;
//                 } catch (e) {
//                     console.error('Error analyzing URL:', result.code);
//                 }
//             } catch (e) {
//                 console.error('Error analyzing URL:', e);
//             }

//             try {
//                 if (!flag) {
//                     const result = await fetch('/api/url', {
//                         method: 'POST',
//                         body: JSON.stringify({
//                             url,
//                         }),
//                     })
//                         .then((res) => res.json())

//                     title = result.title || '';
//                     keywords = result.keywords || '';
//                     description = result.description || '';
//                     h1 = result.h1?.join('|||') || '';
//                     h2 = result.h2?.join('|||') || '';
//                     h3 = result.h3?.join('|||') || '';
//                 }

//             } catch (error) {
//                 console.error('Error analyzing URL:', error);
//             }

//             return {
//                 index: index + 1,
//                 url,
//                 count, // 保留数量字段
//                 title,
//                 keywords,
//                 description,
//                 summary,
//                 industry,
//                 risk,
//                 why: why || '',
//                 status: flag ? 'completed' : 'pending',
//                 h1,
//                 h2,
//                 h3
//             };
//         }
