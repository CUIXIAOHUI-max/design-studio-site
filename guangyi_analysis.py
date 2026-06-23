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
# 1. 项目主数据（已修改牛池湾数据）
# ============================================================
projects_data = {
    '项目名称': [
        '美孚新邨113 3C',
        '港灣豪庭7座34F',
        '牛池灣警察宿舍1座22',  # ✅ 已修改
        '將軍澳彩明苑D座901室',
        '翔東村翔輝樓1621室',
        '屯門 黃金海灣F室',
        '翔東村翔月樓1201'
    ],
    '合同金额': [1030000, 568000, 124000, 708000, 340000, 200000, 440000],
    '总入账': [360000, 198800, 124000, 531000, 315000, 0, 0],  # 牛池湾已全额入账
    '总支出': [63581.65, 3476.27, 81939.45, 515506.94, 0, 145236.20, 410287.03],
    '当前阶段': [
        '二期（清拆中）', 
        '二期（清拆中）', 
        '✅ 已結束（全額收款）',  # 已修改
        '四期（泥水/油漆）', 
        '待開工', 
        '待開工', 
        '待開工'
    ],
    '完成百分比': [0.25, 0.35, 1.0, 0.65, 0.05, 0.05, 0.10],  # 牛池湾 100% 完成
    '各期收款': [
        [103000, 257000, 0, 0, 0, 0],                                      # 美孚
        [56800, 0, 0, 0, 0, 0],                                            # 港湾
        [12400, 31000, 31000, 31000, 12400, 6200],                        # ✅ 牛池湾：6期全部收齐
        [70800, 177000, 177000, 177000, 0, 0],                             # 将军澳
        [0, 0, 0, 0, 0, 0],                                                # 翔辉楼
        [0, 0, 0, 0, 0, 0],                                                # 屯门
        [0, 0, 0, 0, 0, 0]                                                 # 翔月楼
    ]
}

df_main = pd.DataFrame(projects_data)

# 计算各项目核心指标
df_main['余额'] = df_main['总入账'] - df_main['总支出']
df_main['毛利率'] = df_main.apply(lambda x: (x['总入账'] - x['总支出']) / x['总入账'] if x['总入账'] > 0 else None, axis=1)
df_main['合同执行率'] = df_main.apply(lambda x: x['总入账'] / x['合同金额'] if x['合同金额'] > 0 else 0, axis=1)

# 各期名称
phase_names = ['一期(10%)', '二期(25%)', '三期(25%)', '四期(25%)', '五期(10%)', '六期(5%)']

# ============================================================
# 2. 费用分类数据
# ============================================================
expense_detail = {
    '美孚新邨113 3C': {'人工費': 30000, '材料費': 25989.51, '運輸費': 1302.14, '其他': 5000 + 6500 + 2000 + 5000},
    '港灣豪庭7座34F': {'人工費': 25000, '材料費': 3476.27, '運輸費': 0, '其他': 0},
    '牛池灣警察宿舍1座22': {'人工費': 18000, '材料費': 0, '運輸費': 6000, '其他': 57939.45},
    '將軍澳彩明苑D座901室': {'人工費': 80000+80000+40000+60000+4500+6000, '材料費': 20000+20000+13905.47+1157.55+3500+29450+21000+57852.8+23141.12, '運輸費': 0, '其他': 50000+5000},
    '翔東村翔輝樓1621室': {'人工費': 0, '材料費': 0, '運輸費': 0, '其他': 0},
    '屯門 黃金海灣F室': {'人工費': 30000, '材料費': 69448.8, '運輸費': 5787.4, '其他': 20000+20000},
    '翔東村翔月樓1201': {'人工費': 20000+97000+30000+20000+30000, '材料費': 25000, '運輸費': 5781.59, '其他': 92505.44+20000+70000},
}

# ============================================================
# 3. 图表生成函数
# ============================================================

def create_chart_bar(project_name, df_main):
    """图1：柱状图 - 收入 vs 支出 vs 余额"""
    data = df_main[df_main['项目名称'] == project_name].iloc[0]
    
    fig, ax = plt.subplots(figsize=(8, 6))
    categories = ['總收入', '總支出', '項目餘額']
    values = [data['总入账'], data['总支出'], data['余额']]
    colors = ['#2B4B6F', '#8DB5C7', '#4A7A9C' if values[2] >= 0 else '#B22222']
    
    bars = ax.bar(categories, values, color=colors, edgecolor='white', linewidth=1.5)
    
    for bar, val in zip(bars, values):
        ax.annotate(f'HKD {val:,.0f}',
                    xy=(bar.get_x() + bar.get_width()/2, bar.get_height()),
                    xytext=(0, 5 if val >= 0 else -15),
                    textcoords="offset points",
                    ha='center', va='bottom' if val >= 0 else 'top',
                    fontsize=11, fontweight='bold')
    
    ax.set_ylabel('金額（HKD）', fontsize=12, fontweight='bold')
    ax.set_title(f'{project_name} - 收支與盈虧對比', fontsize=14, fontweight='bold', color='#2B4B6F')
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    
    plt.tight_layout()
    filename = f'01_柱状图_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 01_柱状图_{project_name}.png')


def create_chart_pie(project_name, expense_detail):
    """图2：饼图 - 费用结构占比"""
    expense_cats = expense_detail.get(project_name, {'人工費': 0, '材料費': 0, '運輸費': 0, '其他': 0})
    expense_cats = {k: v for k, v in expense_cats.items() if v > 0}
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    if sum(expense_cats.values()) > 0:
        labels = list(expense_cats.keys())
        sizes = list(expense_cats.values())
        colors = ['#2B4B6F', '#4A7A9C', '#8DB5C7', '#A8C9D9']
        
        wedges, texts, autotexts = ax.pie(
            sizes,
            labels=labels,
            autopct=lambda pct: f'{pct:.1f}%\n(HKD {pct/100 * sum(sizes):,.0f})',
            startangle=90,
            colors=colors[:len(labels)],
            textprops={'fontsize': 10},
            wedgeprops={'edgecolor': 'white', 'linewidth': 2}
        )
        ax.set_title(f'{project_name} - 費用結構佔比', fontsize=14, fontweight='bold', color='#2B4B6F')
    else:
        ax.text(0.5, 0.5, '暫無支出數據', ha='center', va='center', fontsize=14, color='#4A7A9C')
        ax.set_title(f'{project_name} - 費用結構佔比', fontsize=14, fontweight='bold', color='#2B4B6F')
    
    plt.tight_layout()
    filename = f'02_饼图_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 02_饼图_{project_name}.png')


def create_chart_line(project_name, df_main):
    """图3：折线图 - 各期收款进度"""
    idx = df_main[df_main['项目名称'] == project_name].index[0]
    phase_amounts = df_main.loc[idx, '各期收款']
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    # 计算累计收款
    cumsum = np.cumsum(phase_amounts)
    phase_pct = [a / df_main.loc[idx, '合同金额'] * 100 if df_main.loc[idx, '合同金额'] > 0 else 0 for a in cumsum]
    
    # 绘制折线
    ax.plot(phase_names, phase_amounts, marker='o', linewidth=2.5, markersize=10, 
            color='#2B4B6F', label='各期收款金額')
    ax.plot(phase_names, [df_main.loc[idx, '合同金额']/6]*6, linestyle='--', 
            color='#B22222', alpha=0.6, label='平均線')
    
    # 添加数值标签
    for i, val in enumerate(phase_amounts):
        if val > 0:
            ax.annotate(f'HKD {val:,.0f}', (phase_names[i], val),
                       xytext=(0, 10), textcoords="offset points",
                       ha='center', fontsize=9, fontweight='bold')
    
    ax.set_xlabel('收款階段', fontsize=12, fontweight='bold')
    ax.set_ylabel('金額（HKD）', fontsize=12, fontweight='bold')
    ax.set_title(f'{project_name} - 各期收款進度', fontsize=14, fontweight='bold', color='#2B4B6F')
    ax.legend(loc='upper right')
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    filename = f'03_折线图_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 03_折线图_{project_name}.png')


def create_chart_donut(project_name, df_main):
    """图4：环形图（圆环图）- 合同执行率"""
    data = df_main[df_main['项目名称'] == project_name].iloc[0]
    exec_rate = data['合同执行率']
    
    fig, ax = plt.subplots(figsize=(8, 6))
    
    # 环形图数据：已执行 vs 未执行
    sizes = [exec_rate * 100, (1 - exec_rate) * 100]
    colors = ['#2B4B6F', '#E8EEF5']
    
    wedges, texts, autotexts = ax.pie(
        sizes,
        labels=['已執行', '待執行'],
        autopct=lambda pct: f'{pct:.1f}%' if pct > 1 else '',
        startangle=90,
        colors=colors,
        textprops={'fontsize': 12, 'fontweight': 'bold'},
        wedgeprops={'edgecolor': 'white', 'linewidth': 2, 'width': 0.5}
    )
    
    # 中间显示执行率
    ax.text(0, 0, f'{exec_rate:.1%}', ha='center', va='center', 
            fontsize=24, fontweight='bold', color='#2B4B6F')
    ax.text(0, -0.15, '合同執行率', ha='center', va='center', 
            fontsize=12, color='#4A7A9C')
    
    ax.set_title(f'{project_name} - 合同執行率', fontsize=14, fontweight='bold', color='#2B4B6F')
    
    plt.tight_layout()
    filename = f'04_环形图_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 04_环形图_{project_name}.png')


def create_chart_progress(project_name, df_main):
    """图5：进度条 - 项目完成进度"""
    data = df_main[df_main['项目名称'] == project_name].iloc[0]
    progress = data['完成百分比']
    
    fig, ax = plt.subplots(figsize=(8, 3))
    
    # 绘制进度条
    y_pos = 0
    ax.barh(y_pos, progress, color='#2B4B6F', height=0.5, edgecolor='white', linewidth=1)
    ax.barh(y_pos, 1, color='#E8EEF5', height=0.5, edgecolor='white', linewidth=1, alpha=0.3)
    
    # 添加百分比标签
    ax.text(progress + 0.02, y_pos, f'{progress:.1%}', va='center', fontsize=14, fontweight='bold', color='#2B4B6F')
    
    # 添加阶段标签
    stage = data['当前阶段']
    ax.text(0.5, -0.8, f'當前階段：{stage}', ha='center', fontsize=12, color='#4A7A9C')
    
    ax.set_xlim(0, 1.15)
    ax.set_ylim(-1, 0.6)
    ax.set_yticks([])
    ax.set_xticks([0, 0.25, 0.5, 0.75, 1.0])
    ax.set_xticklabels(['0%', '25%', '50%', '75%', '100%'])
    ax.set_xlabel('完成進度', fontsize=12, fontweight='bold')
    ax.set_title(f'{project_name} - 項目完成進度', fontsize=14, fontweight='bold', color='#2B4B6F')
    ax.grid(axis='x', alpha=0.3, linestyle='--')
    
    plt.tight_layout()
    filename = f'05_进度条_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 05_进度条_{project_name}.png')


def create_chart_radar(project_name, df_main):
    """图6：雷达图 - 项目多维评分"""
    data = df_main[df_main['项目名称'] == project_name].iloc[0]
    
    dimensions = ['收入完成率', '毛利率', '合同執行率', '完成進度', '盈虧狀況']
    
    max_revenue = df_main['总入账'].max() if df_main['总入账'].max() > 0 else 1
    max_balance = df_main['余额'].max() if df_main['余额'].max() > 0 else 1
    
    current_scores = [
        data['总入账'] / max_revenue if max_revenue > 0 else 0,
        data['毛利率'] if pd.notnull(data['毛利率']) and data['毛利率'] >= 0 else 0,
        data['合同执行率'],
        data['完成百分比'],
        (data['余额'] - df_main['余额'].min()) / (max_balance - df_main['余额'].min()) if max_balance > df_main['余额'].min() else 0.5
    ]
    
    avg_scores = [
        df_main['总入账'].mean() / max_revenue if max_revenue > 0 else 0,
        df_main[df_main['毛利率'].notnull()]['毛利率'].mean() if pd.notnull(df_main['毛利率']).any() else 0,
        df_main['合同执行率'].mean(),
        df_main['完成百分比'].mean(),
        0.5
    ]
    
    angles = [n / float(len(dimensions)) * 2 * pi for n in range(len(dimensions))]
    current_scores += current_scores[:1]
    avg_scores += avg_scores[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    
    ax.plot(angles, current_scores, linewidth=2, linestyle='solid', color='#2B4B6F', label=project_name)
    ax.fill(angles, current_scores, color='#2B4B6F', alpha=0.2)
    ax.plot(angles, avg_scores, linewidth=2, linestyle='dashed', color='#B22222', label='項目平均值')
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(dimensions, fontsize=11, fontweight='bold')
    ax.set_ylim(0, 1)
    ax.set_yticks([0.25, 0.5, 0.75, 1.0])
    ax.set_yticklabels(['25%', '50%', '75%', '100%'], fontsize=9)
    ax.grid(alpha=0.3)
    
    ax.set_title(f'{project_name} - 項目綜合評分（與平均對比）', fontsize=14, fontweight='bold', color='#2B4B6F', pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
    
    plt.tight_layout()
    filename = f'06_雷达图_{project_name}.png'
    plt.savefig(filename, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f'  ✅ 06_雷达图_{project_name}.png')


# ============================================================
# 4. 执行
# ============================================================
print("=" * 65)
print("🚀 開始生成各項目可視化圖表（牛池灣已更新為全額入賬）...")
print("=" * 65)

for project in df_main['项目名称']:
    print(f"\n📊 正在處理: {project}")
    create_chart_bar(project, df_main)
    create_chart_pie(project, expense_detail)
    create_chart_line(project, df_main)
    create_chart_donut(project, df_main)
    create_chart_progress(project, df_main)
    create_chart_radar(project, df_main)

print("\n" + "=" * 65)
print("✅ 全部完成！共生成 42 個圖表文件（7個項目 × 6種圖表）")
print("=" * 65)
print("\n📁 文件命名規則：")
print("  01_柱状图_项目名.png    - 收支對比")
print("  02_饼图_项目名.png      - 費用結構")
print("  03_折线图_项目名.png    - 各期收款進度")
print("  04_环形图_项目名.png    - 合同執行率")
print("  05_进度条_项目名.png    - 項目完成進度")
print("  06_雷达图_项目名.png    - 綜合評分對比")

# ============================================================
# 5. 控制台输出汇总表
# ============================================================
print("\n")
print("=" * 100)
print("【廣翊設計項目總覽匯總表（牛池灣已全額入賬）】")
print("=" * 100)

summary_df = df_main.copy()
summary_df['合同金额'] = summary_df['合同金额'].apply(lambda x: f"HKD {x:,.0f}")
summary_df['总入账'] = summary_df['总入账'].apply(lambda x: f"HKD {x:,.0f}")
summary_df['总支出'] = summary_df['总支出'].apply(lambda x: f"HKD {x:,.2f}")
summary_df['余额'] = summary_df['余额'].apply(lambda x: f"HKD {x:,.2f}")
summary_df['毛利率'] = summary_df['毛利率'].apply(lambda x: f"{x:.2%}" if pd.notnull(x) else "N/A")
summary_df['合同执行率'] = summary_df['合同执行率'].apply(lambda x: f"{x:.2%}")

print(summary_df[['项目名称', '合同金额', '总入账', '总支出', '余额', '毛利率', '合同执行率', '当前阶段']].to_string(index=False))