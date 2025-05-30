import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [todayWorkouts, setTodayWorkouts] = useState([]);
  const [dietData, setDietData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [dailyComment, setDailyComment] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 模擬數據載入
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成本週日期
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        week.push({
          day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i],
          date: date.getDate(),
          isToday: date.toDateString() === today.toDateString(),
          fullDate: date,
        });
      }
      setCurrentWeek(week);

      // 今日訓練數據
      setTodayWorkouts([
        { id: 1, training: 'Chest Press', weight: '150 kg', sets: 4, reps: 20, completed: false },
        { id: 2, training: 'Bench Press', weight: '150 kg', sets: 4, reps: 12, completed: false },
        { id: 3, training: 'Cable chest fly', weight: '150 kg', sets: 5, reps: 12, completed: false },
        { id: 4, training: 'Cable Crossover', weight: '150 kg', sets: 3, reps: 16, completed: false },
      ]);

      // 飲食數據（過去7天）
      setDietData([25, 30, 28, 35, 32, 29, 31]);

      // 體重數據（過去7天）
      setWeightData([70, 69.8, 70.2, 69.9, 70.1, 69.7, 70.0]);

      // 生成每日評論
      generateDailyComment();

    } catch (error) {
      console.error('載入數據失敗:', error);
      Alert.alert('錯誤', '載入數據失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const generateDailyComment = () => {
    const comments = [
      "Great job today!",
      "Keep pushing!",
      "Excellent workout!",
      "Stay consistent!",
      "You're getting stronger!",
    ];
    setDailyComment(comments[Math.floor(Math.random() * comments.length)]);
  };

  const markWorkoutComplete = async (workoutId) => {
    try {
      setTodayWorkouts(prev => 
        prev.map(workout => 
          workout.id === workoutId 
            ? { ...workout, completed: true }
            : workout
        )
      );
      
      // 這裡可以添加 Firebase 保存邏輯
      console.log('Workout marked complete:', workoutId);
    } catch (error) {
      console.error('標記訓練失敗:', error);
      Alert.alert('錯誤', '標記訓練失敗');
    }
  };

  const handleCheckIn = () => {
    Alert.alert(
      '拍照打卡',
      '選擇拍照方式',
      [
        { text: '取消', style: 'cancel' },
        { text: '相機', onPress: () => console.log('打開相機') },
        { text: '相簿', onPress: () => console.log('打開相簿') },
      ]
    );
  };

  const renderWeeklyCalendar = () => (
    <View style={styles.card}>
      <View style={styles.calendarHeader}>
        <View style={styles.weekContainer}>
          {currentWeek.map((day, index) => (
            <View
              key={index}
              style={[
                styles.dayContainer,
                day.isToday && styles.todayContainer,
              ]}
            >
              <Text style={[
                styles.dayLabel,
                day.isToday && styles.todayText,
              ]}>
                {day.day}
              </Text>
              <Text style={[
                styles.dateLabel,
                day.isToday && styles.todayText,
              ]}>
                {day.date}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Text style={styles.calendarButtonText}>Click to Calendar</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTodayWorkouts = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Today Workouts</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Training</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Weight</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>No. of Set</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>No. of Reps</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}></Text>
      </View>
      {todayWorkouts.map((workout) => (
        <View key={workout.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{workout.training}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{workout.weight}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{workout.sets}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{workout.reps}</Text>
          <TouchableOpacity
            style={[
              styles.doneButton,
              workout.completed && styles.completedButton,
            ]}
            onPress={() => !workout.completed && markWorkoutComplete(workout.id)}
            disabled={workout.completed}
          >
            <Text style={styles.doneButtonText}>
              {workout.completed ? 'COMPLETED' : 'DONE'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderCharts = () => (
    <View style={styles.chartsContainer}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Diet</Text>
        <LineChart
          data={{
            datasets: [{
              data: dietData,
            }],
          }}
          width={screenWidth * 0.42}
          height={100}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            color: (opacity = 1) => `rgba(0, 206, 209, ${opacity})`,
            strokeWidth: 2,
            propsForDots: {
              r: "3",
              strokeWidth: "1",
              stroke: "#00CED1"
            },
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          bezier
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          style={styles.chart}
        />
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weight</Text>
        <LineChart
          data={{
            datasets: [{
              data: weightData,
            }],
          }}
          width={screenWidth * 0.42}
          height={100}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            color: (opacity = 1) => `rgba(0, 206, 209, ${opacity})`,
            strokeWidth: 2,
            propsForDots: {
              r: "3",
              strokeWidth: "1",
              stroke: "#00CED1"
            },
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          bezier
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          style={styles.chart}
        />
      </View>
    </View>
  );

  const renderBottomActions = () => (
    <View style={styles.actionsContainer}>
      <View style={styles.commentCard}>
        <Text style={styles.commentText}>
          {dailyComment || "(comment GENERATED)"}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.checkInCard} onPress={handleCheckIn}>
        <Text style={styles.checkInText}>Check In</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00CED1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C2526" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderWeeklyCalendar()}
        {renderTodayWorkouts()}
        {renderCharts()}
        {renderBottomActions()}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C2526',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#2E3A3B',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  
  // Weekly Calendar Styles
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  todayContainer: {
    backgroundColor: '#ffffff',
  },
  dayLabel: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  dateLabel: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
  },
  todayText: {
    color: '#000000',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  calendarButtonText: {
    fontSize: 12,
    color: '#ffffff',
    marginRight: 5,
  },
  
  // Workout Table Styles
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5657',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    color: '#A9A9A9',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#4A5657',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 8,
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  doneButtonText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Charts Styles
  chartsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  chartCard: {
    backgroundColor: '#2E3A3B',
    borderRadius: 10,
    padding: 15,
    width: screenWidth * 0.45,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 5,
  },
  
  // Bottom Actions Styles
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  commentCard: {
    backgroundColor: '#2E3A3B',
    borderRadius: 10,
    padding: 15,
    width: screenWidth * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 14,
    color: '#A9A9A9',
    textAlign: 'center',
  },
  checkInCard: {
    backgroundColor: '#2E3A3B',
    borderRadius: 10,
    padding: 15,
    width: screenWidth * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
}); 