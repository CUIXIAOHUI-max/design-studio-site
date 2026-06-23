import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from math import pi
import warnings
warnings.filterwarnings('ignore')

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['PingFang HK', 'Heiti TC', 'Microsoft YaHei', 'Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# ============================================================
# 1. 项目主数据
# ============================================================
projects_data = {
    '项目名称': [
        '美孚新邨113-3C',
        '港灣豪庭7座34F',
        '牛池灣警察宿舍1座22',
        '將軍澳彩明苑D座901室',
        '翔東村翔輝樓1621室',
        '屯門黃金海灣F室',
        '翔東村翔月樓1201'
    ],
    '合同金额': [1030000, 568000, 124000, 708000, 340000, 200000, 440000],
    '总入账': [360000, 198800, 124000, 531000, 315000, 0, 0],
    '总支出': [63581.65, 3476.27, 81939.45, 515506.94, 0, 145236.20, 410287.03],
    '当前阶段': ['二期(清拆中)', '二期(清拆中)', '✅已結束(全額收款)', '四期(泥水/油漆)', '待開工', '待開工', '待開工'],
    '完成百分比': [0.25, 0.35, 1.0, 0.65, 0.05, 0.05, 0.10],
    '各期收款': [
        [103000, 257000, 0, 0, 0, 0],
        [56800, 0, 0, 0, 0, 0],
        [12400, 31000, 31000, 31000, 12400, 6200],
        [70800, 177000, 177000, 177000, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ]
}

df = pd.DataFrame(projects_data)

# 计算指标
df['余额'] = df['总入账'] - df['总支出']
df['毛利率'] = df.apply(lambda x: (x['总入账'] - x['总支出']) / x['总入账'] if x['总入账'] > 0 else None, axis=1)
df['合同执行率'] = df.apply(lambda x: x['总入账'] / x['合同金额'] if x['合同金额'] > 0 else 0, axis=1)

# 费用分类
expense_detail = {
    '美孚新邨113-3C': {'人工費': 30000, '材料費': 25989.51, '運輸費': 1302.14, '其他': 5000+6500+2000+5000},
    '港灣豪庭7座34F': {'人工費': 25000, '材料費': 3476.27, '運輸費': 0, '其他': 0},
    '牛池灣警察宿舍1座22': {'人工費': 18000, '材料費': 0, '運輸費': 6000, '其他': 57939.45},
    '將軍澳彩明苑D座901室': {'人工費': 80000+80000+40000+60000+4500+6000, '材料費': 20000+20000+13905.47+1157.55+3500+29450+21000+57852.8+23141.12, '運輸費': 0, '其他': 50000+5000},
    '翔東村翔輝樓1621室': {'人工費': 0, '材料費': 0, '運輸費': 0, '其他': 0},
    '屯門黃金海灣F室': {'人工費': 30000, '材料費': 69448.8, '運輸費': 5787.4, '其他': 20000+20000},
    '翔東村翔月樓1201': {'人工費': 20000+97000+30000+20000+30000, '材料費': 25000, '運輸費': 5781.59, '其他': 92505.44+20000+70000},
}
phase_names = ['一期(10%)', '二期(25%)', '三期(25%)', '四期(25%)', '五期(10%)', '六期(5%)']

print("=" * 70)
print("🚀 開始生成所有項目獨立圖表 + 匯總對比圖表")
print("=" * 70)

# ============================================================
# 2. 每个项目独立生成 6 张图表
# ============================================================
def generate_single_project(project_name, df, expense_detail):
    """为单个项目生成 6 张图表，文件名包含项目名"""
    
    row = df[df['项目名称'] == project_name].iloc[0]
    expense = expense_detail.get(project_name, {})
    
    # ---- 图1: 柱状图 ----
    fig, ax = plt.subplots(figsize=(8, 5))
    cats = ['總收入', '總支出', '項目餘額']
    vals = [row['总入账'], row['总支出'], row['余额']]
    colors_bar = ['#2B4B6F', '#8DB5C7', '#4A7A9C' if vals[2] >= 0 else '#B22222']
    bars = ax.bar(cats, vals, color=colors_bar, edgecolor='white', linewidth=1.5)
    for bar, val in zip(bars, vals):
        ax.annotate(f'HKD {val:,.0f}', (bar.get_x()+bar.get_width()/2, bar.get_height()),
                   xytext=(0, 5 if val>=0 else -15), textcoords="offset points",
                   ha='center', va='bottom' if val>=0 else 'top', fontsize=10, fontweight='bold')
    ax.set_ylabel('金額（HKD）', fontsize=11, fontweight='bold')
    ax.set_title(f'{project_name} - 收支與盈虧對比', fontsize=13, fontweight='bold', color='#2B4B6F')
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    plt.tight_layout()
    filename = f'{project_name}_01_柱状图.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

    # ---- 图2: 饼图 ----
    fig, ax = plt.subplots(figsize=(8, 5))
    exp = {k: v for k, v in expense.items() if v > 0}
    if sum(exp.values()) > 0:
        ax.pie(list(exp.values()), labels=list(exp.keys()), autopct=lambda p: f'{p:.1f}%',
               startangle=90, colors=['#2B4B6F','#4A7A9C','#8DB5C7','#A8C9D9'],
               wedgeprops={'edgecolor':'white','linewidth':2})
        ax.set_title(f'{project_name} - 費用結構佔比', fontsize=13, fontweight='bold', color='#2B4B6F')
    else:
        ax.text(0.5, 0.5, '暫無支出數據', ha='center', va='center', fontsize=14, color='#4A7A9C')
        ax.set_title(f'{project_name} - 費用結構佔比', fontsize=13, fontweight='bold', color='#2B4B6F')
    plt.tight_layout()
    filename = f'{project_name}_02_饼图.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

    # ---- 图3: 折线图 ----
    fig, ax = plt.subplots(figsize=(8, 5))
    idx = df[df['项目名称'] == project_name].index[0]
    amounts = df.loc[idx, '各期收款']
    ax.plot(phase_names, amounts, marker='o', linewidth=2.5, markersize=10, color='#2B4B6F', label='各期收款')
    for i, v in enumerate(amounts):
        if v > 0:
            ax.annotate(f'HKD {v:,.0f}', (phase_names[i], v), xytext=(0,8), textcoords="offset points",
                       ha='center', fontsize=8, fontweight='bold')
    ax.set_xlabel('收款階段', fontsize=11, fontweight='bold')
    ax.set_ylabel('金額（HKD）', fontsize=11, fontweight='bold')
    ax.set_title(f'{project_name} - 各期收款進度', fontsize=13, fontweight='bold', color='#2B4B6F')
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    plt.tight_layout()
    filename = f'{project_name}_03_折线图.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

    # ---- 图4: 环形图 ----
    fig, ax = plt.subplots(figsize=(8, 5))
    rate = row['合同执行率']
    ax.pie([rate*100, (1-rate)*100], labels=['已執行','待執行'], autopct=lambda p: f'{p:.1f}%' if p>1 else '',
           startangle=90, colors=['#2B4B6F','#E8EEF5'], wedgeprops={'edgecolor':'white','linewidth':2,'width':0.5})
    ax.text(0, 0, f'{rate:.1%}', ha='center', va='center', fontsize=22, fontweight='bold', color='#2B4B6F')
    ax.text(0, -0.15, '合同執行率', ha='center', va='center', fontsize=11, color='#4A7A9C')
    ax.set_title(f'{project_name} - 合同執行率', fontsize=13, fontweight='bold', color='#2B4B6F')
    plt.tight_layout()
    filename = f'{project_name}_04_环形图.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

    # ---- 图5: 进度条 ----
    fig, ax = plt.subplots(figsize=(8, 3))
    p = row['完成百分比']
    ax.barh(0, p, color='#2B4B6F', height=0.5)
    ax.barh(0, 1, color='#E8EEF5', height=0.5, alpha=0.3)
    ax.text(p+0.02, 0, f'{p:.0%}', va='center', fontsize=14, fontweight='bold', color='#2B4B6F')
    ax.text(0.5, -0.8, f'當前階段：{row["当前阶段"]}', ha='center', fontsize=11, color='#4A7A9C')
    ax.set_xlim(0, 1.15)
    ax.set_ylim(-1, 0.6)
    ax.set_yticks([])
    ax.set_xticks([0, 0.25, 0.5, 0.75, 1.0])
    ax.set_xticklabels(['0%','25%','50%','75%','100%'])
    ax.set_xlabel('完成進度', fontsize=11, fontweight='bold')
    ax.set_title(f'{project_name} - 項目完成進度', fontsize=13, fontweight='bold', color='#2B4B6F')
    ax.grid(axis='x', alpha=0.3, linestyle='--')
    plt.tight_layout()
    filename = f'{project_name}_05_进度条.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

    # ---- 图6: 雷达图 ----
    fig, ax = plt.subplots(figsize=(7, 7), subplot_kw=dict(polar=True))
    dims = ['收入完成率', '毛利率', '合同執行率', '完成進度', '盈虧狀況']
    max_rev = df['总入账'].max() or 1
    max_bal = df['余额'].max() or 1
    min_bal = df['余额'].min()
    scores = [
        row['总入账'] / max_rev,
        row['毛利率'] if pd.notnull(row['毛利率']) and row['毛利率'] >= 0 else 0,
        row['合同执行率'],
        row['完成百分比'],
        (row['余额'] - min_bal) / (max_bal - min_bal) if max_bal > min_bal else 0.5
    ]
    avg_scores = [
        df['总入账'].mean() / max_rev,
        df[df['毛利率'].notnull()]['毛利率'].mean() if df['毛利率'].notnull().any() else 0,
        df['合同执行率'].mean(),
        df['完成百分比'].mean(),
        0.5
    ]
    angles = [n / len(dims) * 2 * pi for n in range(len(dims))]
    scores += scores[:1]
    avg_scores += avg_scores[:1]
    angles += angles[:1]
    ax.plot(angles, scores, linewidth=2, color='#2B4B6F', label=project_name)
    ax.fill(angles, scores, color='#2B4B6F', alpha=0.15)
    ax.plot(angles, avg_scores, linewidth=2, linestyle='dashed', color='#B22222', label='平均值')
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(dims, fontsize=10, fontweight='bold')
    ax.set_ylim(0, 1)
    ax.set_yticks([0.25, 0.5, 0.75, 1.0])
    ax.set_yticklabels(['25%','50%','75%','100%'], fontsize=8)
    ax.grid(alpha=0.3)
    ax.set_title(f'{project_name} - 綜合評分雷達', fontsize=13, fontweight='bold', color='#2B4B6F', pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.2, 1.0), fontsize=9)
    plt.tight_layout()
    filename = f'{project_name}_06_雷达图.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ {filename}')

# ============================================================
# 3. 为每个项目生成独立图表
# ============================================================
print("\n📊 第一部分：各項目獨立圖表")
print("-" * 50)

for proj in df['项目名称']:
    print(f"\n📁 處理: {proj}")
    generate_single_project(proj, df, expense_detail)

# ============================================================
# 4. 汇总对比图表（6张）
# ============================================================
print("\n" + "=" * 70)
print("📊 第二部分：匯總對比圖表")
print("-" * 50)

# ---- 汇总图1: 多项目收支对比 ----
print("\n📈 生成: 汇总对比_01_多项目收支对比.png")
fig, ax = plt.subplots(figsize=(14, 7))
x = np.arange(len(df))
w = 0.25
ax.bar(x-w, df['总入账'], w, label='總收入', color='#2B4B6F')
ax.bar(x, df['总支出'], w, label='總支出', color='#8DB5C7')
ax.bar(x+w, df['余额'], w, label='項目餘額', color=['#4A7A9C' if v>=0 else '#B22222' for v in df['余额']])
ax.set_xticks(x)
ax.set_xticklabels(df['项目名称'], rotation=20, ha='right', fontsize=10)
ax.set_ylabel('金額（HKD）', fontsize=12, fontweight='bold')
ax.set_title('📊 各項目收支與盈虧對比（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F')
ax.legend(fontsize=11)
ax.grid(axis='y', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig('汇总对比_01_多项目收支对比.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_01_多项目收支对比.png")

# ---- 汇总图2: 毛利率对比 ----
print("📈 生成: 汇总对比_02_毛利率对比.png")
fig, ax = plt.subplots(figsize=(12, 6))
df_m = df[df['毛利率'].notnull()].sort_values('毛利率')
y = np.arange(len(df_m))
bars = ax.barh(y, df_m['毛利率'], color=['#2B4B6F' if v>=0.3 else '#8DB5C7' if v>=0.1 else '#B22222' for v in df_m['毛利率']])
for bar, v in zip(bars, df_m['毛利率']):
    ax.annotate(f'{v:.1%}', (bar.get_width()+0.01, bar.get_y()+bar.get_height()/2), va='center', fontsize=11)
ax.set_yticks(y)
ax.set_yticklabels(df_m['项目名称'], fontsize=11)
ax.set_xlabel('毛利率', fontsize=12, fontweight='bold')
ax.set_title('📊 各項目毛利率對比（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F')
ax.set_xlim(0, 1.05)
ax.axvline(df_m['毛利率'].mean(), color='#B22222', linestyle='--', alpha=0.7, label=f'平均 {df_m["毛利率"].mean():.1%}')
ax.legend()
ax.grid(axis='x', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig('汇总对比_02_毛利率对比.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_02_毛利率对比.png")

# ---- 汇总图3: 合同执行率 ----
print("📈 生成: 汇总对比_03_合同执行率对比.png")
fig, ax = plt.subplots(figsize=(12, 6))
df_s = df.sort_values('合同执行率')
y = np.arange(len(df_s))
bars = ax.barh(y, df_s['合同执行率'], color=['#2B4B6F' if v>=0.8 else '#8DB5C7' if v>=0.5 else '#B22222' for v in df_s['合同执行率']])
for bar, v in zip(bars, df_s['合同执行率']):
    ax.annotate(f'{v:.1%}', (bar.get_width()+0.01, bar.get_y()+bar.get_height()/2), va='center', fontsize=11)
ax.set_yticks(y)
ax.set_yticklabels(df_s['项目名称'], fontsize=11)
ax.set_xlabel('合同執行率', fontsize=12, fontweight='bold')
ax.set_title('📊 各項目合同執行率對比（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F')
ax.set_xlim(0, 1.05)
ax.axvline(df_s['合同执行率'].mean(), color='#B22222', linestyle='--', alpha=0.7, label=f'平均 {df_s["合同执行率"].mean():.1%}')
ax.legend()
ax.grid(axis='x', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig('汇总对比_03_合同执行率对比.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_03_合同执行率对比.png")

# ---- 汇总图4: 完成进度 ----
print("📈 生成: 汇总对比_04_项目完成进度对比.png")
fig, ax = plt.subplots(figsize=(12, 6))
df_s = df.sort_values('完成百分比')
y = np.arange(len(df_s))
bars = ax.barh(y, df_s['完成百分比'], color='#2B4B6F')
for bar, v, name in zip(bars, df_s['完成百分比'], df_s['项目名称']):
    ax.annotate(f'{v:.0%}', (bar.get_width()+0.01, bar.get_y()+bar.get_height()/2), va='center', fontsize=11)
    stage = df_s[df_s['项目名称']==name]['当前阶段'].values[0]
    ax.annotate(stage, (1.05, bar.get_y()+bar.get_height()/2), va='center', fontsize=9, color='#4A7A9C')
ax.set_yticks(y)
ax.set_yticklabels(df_s['项目名称'], fontsize=11)
ax.set_xlabel('完成進度', fontsize=12, fontweight='bold')
ax.set_title('📊 各項目完成進度對比（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F')
ax.set_xlim(0, 1.35)
ax.grid(axis='x', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig('汇总对比_04_项目完成进度对比.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_04_项目完成进度对比.png")

# ---- 汇总图5: 费用堆叠 ----
print("📈 生成: 汇总对比_05_费用结构堆叠图.png")
fig, ax = plt.subplots(figsize=(14, 7))
cats = ['人工費', '材料費', '運輸費', '其他']
colors_stack = ['#2B4B6F', '#4A7A9C', '#8DB5C7', '#A8C9D9']
projs = list(expense_detail.keys())
data = {c: [expense_detail[p].get(c, 0) for p in projs] for c in cats}
x = np.arange(len(projs))
bottom = np.zeros(len(projs))
for i, c in enumerate(cats):
    ax.bar(x, data[c], bottom=bottom, label=c, color=colors_stack[i])
    bottom += np.array(data[c])
ax.set_xticks(x)
ax.set_xticklabels(projs, rotation=20, ha='right', fontsize=10)
ax.set_ylabel('金額（HKD）', fontsize=12, fontweight='bold')
ax.set_title('📊 各項目費用結構堆疊圖（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F')
ax.legend(fontsize=11)
ax.grid(axis='y', alpha=0.3, linestyle='--')
plt.tight_layout()
plt.savefig('汇总对比_05_费用结构堆叠图.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_05_费用结构堆叠图.png")

# ---- 汇总图6: 综合雷达 ----
print("📈 生成: 汇总对比_06_综合雷达对比.png")
from math import pi
df_radar = df[df['总入账'] > 0]
dims = ['收入', '毛利率', '合同執行率', '完成進度', '盈虧']
max_rev = df_radar['总入账'].max() or 1
max_bal = df_radar['余额'].max() or 1
min_bal = df_radar['余额'].min()
fig, ax = plt.subplots(figsize=(10, 8), subplot_kw=dict(polar=True))
colors_radar = ['#2B4B6F', '#4A7A9C', '#8DB5C7', '#A8C9D9', '#6B9AB0']
for i, (_, row) in enumerate(df_radar.iterrows()):
    scores = [
        row['总入账'] / max_rev,
        row['毛利率'] if pd.notnull(row['毛利率']) and row['毛利率']>=0 else 0,
        row['合同执行率'],
        row['完成百分比'],
        (row['余额'] - min_bal) / (max_bal - min_bal) if max_bal > min_bal else 0.5
    ]
    scores += scores[:1]
    angles = [n / len(dims) * 2 * pi for n in range(len(dims))] + [0]
    ax.plot(angles, scores, linewidth=2, color=colors_radar[i%len(colors_radar)], label=row['项目名称'])
    ax.fill(angles, scores, color=colors_radar[i%len(colors_radar)], alpha=0.08)
ax.set_xticks([n / len(dims) * 2 * pi for n in range(len(dims))])
ax.set_xticklabels(dims, fontsize=11, fontweight='bold')
ax.set_ylim(0, 1)
ax.set_yticks([0.25, 0.5, 0.75, 1.0])
ax.set_yticklabels(['25%','50%','75%','100%'], fontsize=9)
ax.grid(alpha=0.3)
ax.set_title('📊 各項目綜合能力雷達對比（匯總）', fontsize=16, fontweight='bold', color='#2B4B6F', pad=20)
ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0), fontsize=10)
plt.tight_layout()
plt.savefig('汇总对比_06_综合雷达对比.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print("  ✅ 汇总对比_06_综合雷达对比.png")

# ============================================================
# 5. 完成总结
# ============================================================
print("\n" + "=" * 70)
print("✅ 全部完成！")
print("=" * 70)

single_count = len(df) * 6
summary_count = 6
total_count = single_count + summary_count

print(f"\n📁 共生成 {total_count} 張圖表")
print(f"   • 各項目獨立圖表：{single_count} 張（{len(df)}個項目 × 6種）")
print(f"   • 匯總對比圖表：{summary_count} 張")

print("\n📂 文件清單：")
print("\n【各項目獨立圖表】（每個項目6張）")
for proj in df['项目名称']:
    print(f"  {proj}_01_柱状图.png")
    print(f"  {proj}_02_饼图.png")
    print(f"  {proj}_03_折线图.png")
    print(f"  {proj}_04_环形图.png")
    print(f"  {proj}_05_进度条.png")
    print(f"  {proj}_06_雷达图.png")

print("\n【匯總對比圖表】（6張）")
print("  汇总对比_01_多项目收支对比.png")
print("  汇总对比_02_毛利率对比.png")
print("  汇总对比_03_合同执行率对比.png")
print("  汇总对比_04_项目完成进度对比.png")
print("  汇总对比_05_费用结构堆叠图.png")
print("  汇总对比_06_综合雷达对比.png")
dir *.png
