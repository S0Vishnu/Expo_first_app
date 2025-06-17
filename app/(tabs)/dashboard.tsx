import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import {
  TrendingUp,
  TrendingDown,
  ChartBar as BarChart3,
  ChartPie as PieChartIcon,
  Activity,
} from 'lucide-react-native';
import { dashboardStyles } from '../../styles/dashboard';
import RefreshGestureContext from '../../context/RefreshContext';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { colors } = useTheme();
  const styles = dashboardStyles(colors);
  const { activeProfile, transactions, todos } = useData();

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('line');

  const periods = ['week', 'month', '3months', '6months'];
  const chartTypes = ['line', 'bar', 'pie'];

  const userTransactions = transactions.filter(
    (t) => t.profileId === activeProfile?.id
  );

  const getFilteredTransactions = () => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }

    return userTransactions.filter((t) => new Date(t.date) >= startDate);
  };

  const filteredTransactions = getFilteredTransactions();

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const generateChartData = () => {
    const dates = [];
    const incomeData = [];
    const expenseData = [];

    const daysInPeriod = selectedPeriod === 'week' ? 7 : 30;

    for (let i = daysInPeriod - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayTransactions = filteredTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      const dayIncome = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const dayExpense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      dates.push(date.getDate().toString());
      incomeData.push(dayIncome);
      expenseData.push(dayExpense);
    }

    return { dates, incomeData, expenseData };
  };

  const { dates, incomeData, expenseData } = generateChartData();

  const generateCategoryData = () => {
    const categories: { [key: string]: number } = {};

    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });

    return Object.entries(categories).map(([name, amount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: amount as number,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      legendFontColor: colors.text,
      legendFontSize: 12,
    }));
  };

  const categoryData = generateCategoryData();

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      stroke: colors.border,
    },
  };

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const renderChart = () => {
    const chartProps = {
      width: screenWidth - 72,
      height: 220,
      chartConfig,
      style: {
        marginVertical: 8,
        borderRadius: 16,
      },
    };

    switch (selectedChart) {
      case 'bar':
        return (
          <BarChart
            data={{
              labels: dates.slice(-7),
              datasets: [
                {
                  data: expenseData.slice(-7),
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                },
              ],
            }}
            {...chartProps}
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      case 'pie':
        return categoryData.length > 0 ? (
          <PieChart
            data={categoryData}
            width={screenWidth - 72}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <View
            style={{
              height: 220,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={[styles.insightText, { textAlign: 'center' }]}>
              No expense data available
            </Text>
          </View>
        );
      default:
        return (
          <LineChart
            data={{
              labels: dates.slice(-7),
              datasets: [
                {
                  data: incomeData.slice(-7),
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                  strokeWidth: 2,
                },
                {
                  data: expenseData.slice(-7),
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            {...chartProps}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RefreshGestureContext>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodSelector}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period === '3months'
                    ? '3M'
                    : period === '6months'
                    ? '6M'
                    : period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color={colors.success} />

              <Text style={[styles.statValue, { color: colors.success }]}>
                ₹{totalIncome.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Total Income</Text>
            </View>

            <View style={styles.statCard}>
              <TrendingDown size={24} color={colors.error} />
              <Text style={[styles.statValue, { color: colors.error }]}>
                ₹{totalExpense.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>

            <View style={styles.statCard}>
              <Activity size={24} color={colors.primary} />
              <Text style={styles.statValue}>{completionRate.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Task Completion</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Financial Overview</Text>
              <View style={styles.chartTypeSelector}>
                {chartTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chartTypeButton,
                      selectedChart === type && styles.chartTypeButtonActive,
                    ]}
                    onPress={() => setSelectedChart(type)}
                  >
                    {type === 'line' ? (
                      <Activity
                        size={16}
                        color={selectedChart === type ? '#FFFFFF' : colors.text}
                      />
                    ) : type === 'bar' ? (
                      <BarChart3
                        size={16}
                        color={selectedChart === type ? '#FFFFFF' : colors.text}
                      />
                    ) : (
                      <PieChartIcon
                        size={16}
                        color={selectedChart === type ? '#FFFFFF' : colors.text}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {renderChart()}
          </View>

          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Insights</Text>

            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <TrendingUp size={20} color={colors.success} />
              </View>
              <Text style={styles.insightText}>Average daily income</Text>
              <Text style={styles.insightValue}>
                ₹
                {(totalIncome / (selectedPeriod === 'week' ? 7 : 30)).toFixed(
                  2
                )}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <TrendingDown size={20} color={colors.error} />
              </View>
              <Text style={styles.insightText}>Average daily expense</Text>
              <Text style={styles.insightValue}>
                ₹
                {(totalExpense / (selectedPeriod === 'week' ? 7 : 30)).toFixed(
                  2
                )}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <Activity size={20} color={colors.primary} />
              </View>
              <Text style={styles.insightText}>Tasks completed</Text>
              <Text style={styles.insightValue}>
                {completedTodos}/{totalTodos}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <BarChart3 size={20} color={colors.warning} />
              </View>
              <Text style={styles.insightText}>Net balance</Text>
              <Text
                style={[
                  styles.insightValue,
                  {
                    color:
                      totalIncome - totalExpense >= 0
                        ? colors.success
                        : colors.error,
                  },
                ]}
              >
                ₹{(totalIncome - totalExpense).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </RefreshGestureContext>
    </SafeAreaView>
  );
}
