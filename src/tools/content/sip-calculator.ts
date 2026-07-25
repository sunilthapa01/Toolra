import { ToolContent, FAQItem } from '../types';

export const sipCalculatorFaqs: FAQItem[] = [
  {
    question: 'What is a Systematic Investment Plan (SIP)?',
    answer: 'A Systematic Investment Plan (SIP) is a method offered by mutual funds that allows you to invest a fixed amount of money regularly (e.g., monthly or quarterly) into a chosen scheme, rather than making a one-time lumpsum payment.'
  },
  {
    question: 'How is SIP future value calculated?',
    answer: 'SIP future value is calculated using the formula: FV = P × [ ( (1 + i)^n − 1 ) / i ] × (1 + i), where P is the monthly investment amount, i is the monthly interest rate (annual return rate / 12 / 100), and n is the total number of months.'
  },
  {
    question: 'What is the difference between SIP and Lumpsum investment?',
    answer: 'An SIP involves investing small amounts at regular intervals, which helps average out purchase costs and reduces the impact of market volatility. A Lumpsum investment involves investing a large sum of money all at once, which is best suited when you have a windfall or during market corrections.'
  },
  {
    question: 'What is a Step-Up SIP?',
    answer: 'A Step-Up SIP (or top-up SIP) is a feature that allows you to increase your monthly investment amount by a fixed percentage or amount at regular intervals (usually once a year). This helps align your investments with salary increases and builds wealth faster.'
  },
  {
    question: 'How does compounding work in SIP?',
    answer: 'Compounding means you earn returns not only on your initial principal investment but also on the returns that build up over time. In a long-term SIP, compounding accelerates wealth creation, especially in the later years.'
  },
  {
    question: 'What is Rupee Cost Averaging?',
    answer: 'Rupee Cost Averaging is an investment strategy where you invest a fixed amount regularly. When market prices are high, you buy fewer mutual fund units, and when prices are low, you buy more units. Over time, this averages out the cost of your investment.'
  },
  {
    question: 'What interest rate or return percentage should I enter in the SIP Calculator?',
    answer: 'Equity mutual funds in developing markets historically deliver long-term average returns between 12% and 15%. For conservative debt funds, returns typically range between 6% and 8%. You should enter a realistic estimate based on your asset mix.'
  },
  {
    question: 'Are SIP returns guaranteed?',
    answer: 'No. SIP investments are tied to mutual funds, which invest in stock or bond markets. Market investments carry risk, and returns are not guaranteed. However, historically, long-term equity SIPs (over 5-7 years) have delivered strong, inflation-beating returns.'
  },
  {
    question: 'Can I stop or pause my SIP at any time?',
    answer: 'Yes, SIPs are highly flexible. You can pause or stop your SIP at any time without paying penalties. Your accumulated wealth will remain invested and continue to earn compound returns until you decide to withdraw it.'
  },
  {
    question: 'Can I change my SIP investment amount?',
    answer: 'Yes. You can start a new SIP with a different amount or use a Step-Up SIP to automate annual increases. To change the amount of an active SIP, you typically need to stop the current plan and start a new one.'
  },
  {
    question: 'Is there a minimum amount required to start an SIP?',
    answer: 'Most mutual fund schemes allow you to start an SIP with as little as ₹500 per month, making it accessible to students, young professionals, and savers of all income levels.'
  },
  {
    question: 'What is the lock-in period for SIP investments?',
    answer: 'Most mutual funds do not have a lock-in period, meaning you can withdraw your money whenever you need it. However, Equity Linked Savings Schemes (ELSS), which offer tax deductions, have a mandatory lock-in period of 3 years.'
  },
  {
    question: 'Are SIP returns taxable?',
    answer: 'Yes. Equity mutual fund gains are subject to Capital Gains Tax. If units are held for less than a year, gains are taxed as Short-Term Capital Gains (STCG). If held for over a year, gains are taxed as Long-Term Capital Gains (LTCG).'
  },
  {
    question: 'What is the power of starting early in an SIP?',
    answer: 'Starting early gives your money more time to compound. A person starting an SIP at age 25 will accumulate significantly more wealth by age 55 than someone starting the same SIP at age 35, even if the latter invests larger amounts.'
  },
  {
    question: 'How do I use this SIP Calculator to plan my financial goals?',
    answer: 'Estimate the cost of your future goal (e.g., child\'s education, house down payment, or retirement) and the time left to reach it. Adjust the investment amount and expected return rate in our calculator to find the monthly SIP needed to reach your target.'
  }
];

export const sipCalculatorContent: ToolContent = {
  whatIsThis: {
    overview: 'The SIP (Systematic Investment Plan) Calculator is a professional financial utility designed to estimate the future value of periodic investments in mutual funds and equity portfolios. Supporting both recurring SIPs and one-time Lumpsum calculations, the tool uses monthly compound interest formulas to display the future value, the total invested capital, and the net wealth generated.',
    whyExists: 'Consistent, disciplined investing is the cornerstone of long-term wealth creation. However, the compound growth of monthly savings is difficult to calculate manually. This utility exists to give investors a clear picture of how regular contributions compound over time. By demonstrating the impact of investment duration and annual return rates, it helps savers plan their financial goals.',
    realWorldUseCases: [
      'Retirement Portfolio Projections: Calculate how investing a fixed portion of your salary monthly will accumulate by retirement age.',
      'Child Education and Marriage Funds: Estimate the future value needed to fund higher education expenses.',
      'Down Payment Budgeting: Plan monthly savings targets to afford a house or car down payment in a set number of years.',
      'Wealth Building with Step-Up SIP: Calculate how increasing your monthly investment by 10% each year can accelerate your savings.',
      'Lumpsum Wealth Projections: Estimate the growth of a one-time bonus or windfall inheritance over a long-term horizon.'
    ],
    whoShouldUse: [
      'Young Professionals: To start small, regular savings plans and understand the compounding value of time.',
      'Salaried Employees: To automate their savings allocations out of their monthly payroll.',
      'Experienced Investors: To project the growth of their portfolios and align investments with milestones.',
      'Financial Advisors: To model investment outcomes for clients and build retirement plans.',
      'Goal-Oriented Savers: To calculate the exact monthly savings needed to reach their financial targets.'
    ],
    benefits: [
      '100% Client-Side Calculations: Your investment figures and financial goals are processed locally in your browser and never uploaded to a server.',
      'Step-Up Capability: Easily calculate the dramatic impact of increasing your monthly contributions annually.',
      'Dual Calculator: Switch between SIP and Lumpsum modes to compare different investment methods.',
      'Clear Wealth Split: Visually separates the capital invested from the compound interest earned, emphasizing the power of wealth creation.'
    ]
  },
  howToUseSteps: [
    'Choose the Investment Type: Select "SIP" for monthly recurring investments or "Lumpsum" for a one-time investment.',
    'Enter the Investment Amount: Input the monthly savings value or the one-time principal capital.',
    'Set the Expected Return Rate: Input the estimated annual compound interest or average CAGR return (e.g., 12% for equity portfolios).',
    'Select the Time Horizon: Set the duration of your investment in years.',
    'Configure the Step-Up (Optional): Enter an annual percentage increase to simulate growing your monthly contributions over time.',
    'Analyze the Results: Inspect the summary showing the Invested Amount, Est. Returns, and the Future Wealth Value.'
  ],
  workedExamples: [
    {
      title: 'Long-Term Equity SIP (15 Years)',
      scenario: 'An investor starts an SIP of ₹10,000 per month in a diversified equity mutual fund with an expected annual return of 12% for 15 years.',
      calculation: 'Monthly payment P = ₹10,000. Monthly rate i = 12 / 12 / 100 = 0.01. Number of months n = 180. Future Value = 10,000 × [((1.01)^180 − 1) / 0.01] × 1.01 = ₹50,45,760. Total invested capital = 10,000 × 180 = ₹18,00,000.',
      result: 'Invested Capital: ₹18,00,000 | Est. Returns: ₹32,45,760 | Future Portfolio Value: ₹50,45,760'
    },
    {
      title: 'Early Retirement SIP (30 Years)',
      scenario: 'A 25-year-old professional starts an SIP of ₹5,000 per month, targeting retirement at age 55 (30 years) with a conservative average return of 12%.',
      calculation: 'P = ₹5,000. i = 0.01. n = 360 months. Future Value = 5,000 × [((1.01)^360 − 1) / 0.01] × 1.01 = ₹1,76,49,569. Total invested = ₹18,00,000.',
      result: 'Invested Capital: ₹18,00,000 | Est. Returns: ₹1,58,49,569 | Future Portfolio Value: ₹1.76 Crores'
    },
    {
      title: 'Step-Up SIP for Career Growth',
      scenario: 'An investor starts with an SIP of ₹10,000 per month at 12% returns for 10 years, choosing to increase the SIP amount by 10% every year (Step-Up).',
      calculation: 'Year 1: ₹10,000/mo. Year 2: ₹11,000/mo. Year 3: ₹12,100/mo, etc. Future Value with annual step-ups is calculated sequentially to account for increased contributions.',
      result: 'Invested Capital: ₹19,12,491 | Est. Returns: ₹18,85,910 | Future Portfolio Value: ₹37,98,401 (Saves ₹14 Lakhs more than a flat SIP!)'
    },
    {
      title: 'One-Time Lumpsum Investment (10 Years)',
      scenario: 'An investor deposits a lumpsum of ₹1,00,000 into an index fund and lets it compound for 10 years at a historical average return of 12%.',
      calculation: 'Principal P = ₹1,00,000. Annual rate r = 12% = 0.12. Years t = 10. Future Value = P × (1 + r)^t = 1,00,000 × (1.12)^10 = ₹3,10,584.82.',
      result: 'Invested Capital: ₹1,00,000 | Est. Returns: ₹2,10,585 | Future Portfolio Value: ₹3,10,585'
    },
    {
      title: 'Short-Term Goal Debt SIP (5 Years)',
      scenario: 'A saver starts an SIP of ₹15,000 per month in a low-risk debt fund earning 7% annually to fund a wedding in 5 years.',
      calculation: 'P = ₹15,000. Monthly rate i = 7 / 12 / 100 = 0.005833. Tenure n = 60 months. Future Value = ₹10,79,885. Total invested = ₹9,00,000.',
      result: 'Invested Capital: ₹9,00,000 | Est. Returns: ₹1,79,885 | Future Portfolio Value: ₹10,79,885'
    }
  ],
  formulaDetails: {
    equation: `SIP Future Value:
FV = P × [ ( (1 + i)^n − 1 ) / i ] × (1 + i)

Lumpsum Future Value:
FV = P × (1 + r)^t

Where:
P = Principal investment amount
i = Monthly interest rate = (Annual Rate / 12 / 100)
n = Total investment months = (Years × 12)
r = Annual return rate (decimal)
t = Number of years`,
    explanation: 'The SIP formula calculated is the Future Value of an Annuity Due. It calculates the compound returns earned on regular deposits. Because each monthly payment compounds for a different number of months, it uses a geometric progression to find the sum of all compounded contributions.',
    variables: [
      { name: 'P (Monthly Contribution)', description: 'The recurring amount of money invested in the mutual fund each month.' },
      { name: 'i (Monthly Return Rate)', description: 'The expected annual interest rate divided by 12 and by 100 to convert to a decimal.' },
      { name: 'n (Months of Investment)', description: 'The total duration of the SIP plan converted into months.' },
      { name: 'FV (Future Value)', description: 'The total projected portfolio value at the end of the investment tenure.' }
    ]
  },
  commonMistakes: [
    {
      title: 'Stopping SIPs during Market Corrections',
      mistake: 'Withdrawing investments or pausing monthly SIPs when the stock market drops.',
      correction: 'Market downturns allow your SIP to purchase more units at a discount. Stopping your SIP during corrections defeats the benefits of Rupee Cost Averaging.'
    },
    {
      title: 'Assuming Historical Returns are Guaranteed',
      mistake: 'Assuming a fixed annual return (e.g. 15% year-on-year) and borrowing money to invest based on that expectation.',
      correction: 'Market returns fluctuate and are never guaranteed. Use realistic return estimations (11-13% for equity) and avoid leveraging debt to invest.'
    },
    {
      title: 'Underestimating the Power of Step-Up SIPs',
      mistake: 'Keeping your monthly SIP amount flat for 15-20 years despite receiving annual salary increases.',
      correction: 'Even a small 5% to 10% annual Step-Up can nearly double your final wealth accumulated over long periods. Align investments with income growth.'
    }
  ],
  tips: [
    'Automate your monthly SIP transactions to execute immediately after your payday. This ensures you save before you spend.',
    'Conduct a yearly review of your portfolio performance, adjusting your expected rates if your asset allocation shifts.',
    'Focus on your total time in the market rather than trying to time the market. Patience is the single most important factor for compounding success.'
  ]
};
