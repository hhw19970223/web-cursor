// ==================== 数据处理工具 ====================

/**
 * 查找URL列
 * @param {Object} firstRow - 第一行数据
 * @returns {string|null} - URL列名
 */
function findUrlColumn(firstRow) {
    const urlKeywords = [
        'url', 'URL', 'Url',
        '网址', '链接', '地址',
        '提取页面url', 'page_url', 'pageUrl', 'page-url',
        'link', 'Link', 'LINK',
        'website', 'Website', 'site'
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
        if (lowerKey.includes('url') || 
            lowerKey.includes('link') || 
            lowerKey.includes('网址') || 
            lowerKey.includes('链接')) {
            return key;
        }
    }

    return null;
}

/**
 * 显示错误弹窗
 * @param {string} message - 错误信息
 */
function showError(message) {
    alert('❌ ' + message);
    
    // 重置状态
    document.getElementById('fileNameDisplay').textContent = '未选择文件';
    document.getElementById('fileInput').value = '';
    document.getElementById('startBtn').disabled = true;
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
        return urlObj.hostname.replace('www.', '');
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
    const parts = domain.split('.');
    keywords.push(...parts[0].split('-'));
    
    // 添加一些相关关键词
    if (domain.includes('shop') || domain.includes('store')) {
        keywords.push('ecommerce', 'shopping');
    }
    if (domain.includes('tech') || domain.includes('dev')) {
        keywords.push('technology', 'software');
    }
    
    return keywords.slice(0, 5).join(', ');
}

/**
 * 生成网站摘要
 * @param {string} url - URL地址
 * @param {string} keywords - 关键词
 * @returns {string} - 网站摘要
 */
function generateSummary(url, keywords) {
    const domain = extractDomain(url);
    return `${domain} 是一个专注于 ${keywords?.split(',')[0] || ''} 相关服务的网站，为用户提供优质的在线体验和专业服务。`;
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
    let detectedIndustry = '其他';
    
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
    
    if (riskScore >= 2) return '高风险';
    if (riskScore === 1) return '可疑';
    
    // 随机模拟一些风险（用于演示）
    const random = Math.random();
    if (random < 0.05) return '高风险';
    if (random < 0.15) return '可疑';
    return '安全';
}

// ==================== 数据导出工具 ====================

/**
 * 导出为XLSX格式
 * @param {Array} data - 数据数组
 * @param {string} filename - 文件名
 */
function exportToExcel(data, filename) {
    // 定义表头
    const headers = ['序号', 'URL', '标题', '关键词', '描述', '网站摘要', '行业分类', '风险评估', '为什么', 'h1', 'h2', 'h3'];
    
    // 转换数据为二维数组
    const rows = data.map(row => [
        row.index,
        row.url,
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
        { wch: 6 },   // 序号
        { wch: 40 },  // URL
        { wch: 30 },  // 标题
        { wch: 25 },  // 关键词
        { wch: 40 },  // 描述
        { wch: 50 },  // 网站摘要
        { wch: 12 },  // 行业分类
        { wch: 10 },  // 风险评估
        { wch: 30 },  // 为什么
        { wch: 25 },  // h1
        { wch: 25 },  // h2
        { wch: 25 },  // h3
    ];
    ws['!cols'] = colWidths;
    
    // 设置表头样式（粗体、背景色）
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!ws[address]) continue;
        ws[address].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" }
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
function addLog(message, type = 'info') {
    const container = document.getElementById('logContainer');
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
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
    const industryChart = echarts.init(document.getElementById('industryChart'));
    const riskChart = echarts.init(document.getElementById('riskChart'));

    const industryOption = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: { fontSize: 12 }
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            data: []
        }]
    };

    const riskOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: {
            type: 'category',
            data: ['安全', '可疑', '高风险', '未知'],
            axisLabel: { fontSize: 12 }
        },
        yAxis: {
            type: 'value',
            axisLabel: { fontSize: 12 }
        },
        series: [{
            type: 'bar',
            data: [0, 0, 0, 0],
            itemStyle: {
                color: (params) => {
                    const colors = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];
                    return colors[params.dataIndex];
                },
                borderRadius: [10, 10, 0, 0]
            }
        }]
    };

    industryChart.setOption(industryOption);
    riskChart.setOption(riskOption);

    // 响应式
    window.addEventListener('resize', () => {
        industryChart.resize();
        riskChart.resize();
    });

    return { industryChart, riskChart };
}

/**
 * 更新图表数据
 * @param {Object} charts - 图表实例对象
 * @param {Array} analyzedResults - 分析结果数组
 */
function updateCharts(charts, analyzedResults) {
    // 行业分布
    const industryCount = {};
    analyzedResults.forEach(result => {
        industryCount[result.industry] = (industryCount[result.industry] || 0) + 1;
    });
    
    const industryData = Object.entries(industryCount).map(([name, value]) => ({
        name, value
    }));
    
    charts.industryChart.setOption({
        series: [{ data: industryData }]
    });
    
    // 风险分布
    const riskCount = { '安全': 0, '可疑': 0, '高风险': 0, '未知': 0 };
    analyzedResults.forEach(result => {
        riskCount[result.risk] = (riskCount[result.risk] || 0) + 1;
    });
    
    charts.riskChart.setOption({
        series: [{ data: Object.values(riskCount) }]
    });
}






