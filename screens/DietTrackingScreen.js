import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FOOD_DATABASE = [
  { id: 1, name: '白米飯', calories: 130, carbs: 28, fat: 0.3, protein: 2.7, unit: '100g' },
  { id: 2, name: '雞胸肉', calories: 165, carbs: 0, fat: 3.6, protein: 31, unit: '100g' },
  { id: 3, name: '蘋果', calories: 52, carbs: 14, fat: 0.2, protein: 0.3, unit: '100g' },
  { id: 4, name: '香蕉', calories: 89, carbs: 23, fat: 0.3, protein: 1.1, unit: '100g' },
  { id: 5, name: '雞蛋', calories: 155, carbs: 1.1, fat: 11, protein: 13, unit: '100g' },
  { id: 6, name: '牛奶', calories: 61, carbs: 4.8, fat: 3.2, protein: 3.2, unit: '100ml' },
  { id: 7, name: '麵包', calories: 265, carbs: 49, fat: 3.2, protein: 9, unit: '100g' },
  { id: 8, name: '沙拉', calories: 20, carbs: 4, fat: 0.2, protein: 1.4, unit: '100g' },
];

export default function DietTrackingScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyGoal] = useState(2600); // 每日卡路里目標
  const [nutritionGoals] = useState({
    carbs: 163,
    fat: 43,
    protein: 65,
  });
  
  const [dietRecord, setDietRecord] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  
  const [weeklyData, setWeeklyData] = useState([
    { day: '週一', calories: 2400 },
    { day: '週二', calories: 2200 },
    { day: '週三', calories: 2300 },
    { day: '週四', calories: 2500 },
    { day: '週五', calories: 2100 },
    { day: '週六', calories: 2600 },
    { day: '週日', calories: 2350 },
  ]);

  const [exerciseCalories] = useState(0);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: '',
    amount: '100',
  });

  const scrollViewRef = useRef(null);
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  useEffect(() => {
    loadDietRecord();
  }, [currentDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const loadDietRecord = async () => {
    try {
      const dateString = getDateString(currentDate);
      const record = await AsyncStorage.getItem(`dietRecord_${dateString}`);
      if (record) {
        setDietRecord(JSON.parse(record));
      } else {
        setDietRecord({
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        });
      }
    } catch (error) {
      console.error('載入飲食記錄失敗:', error);
    }
  };

  const saveDietRecord = async (newRecord) => {
    try {
      const dateString = getDateString(currentDate);
      await AsyncStorage.setItem(`dietRecord_${dateString}`, JSON.stringify(newRecord));
      setDietRecord(newRecord);
    } catch (error) {
      console.error('保存飲食記錄失敗:', error);
    }
  };

  const calculateTotalNutrition = () => {
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;

    Object.values(dietRecord).forEach(meals => {
      meals.forEach(meal => {
        const multiplier = meal.amount / 100;
        totalCalories += meal.calories * multiplier;
        totalCarbs += meal.carbs * multiplier;
        totalFat += meal.fat * multiplier;
        totalProtein += meal.protein * multiplier;
      });
    });

    return {
      calories: Math.round(totalCalories),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      protein: Math.round(totalProtein),
    };
  };

  const addFood = async (selectedFood, isCustom = false) => {
    const amount = parseFloat(customFood.amount) || 100;
    const multiplier = amount / 100;
    
    let foodItem;
    if (isCustom) {
      foodItem = {
        ...customFood,
        calories: parseFloat(customFood.calories),
        carbs: parseFloat(customFood.carbs),
        fat: parseFloat(customFood.fat),
        protein: parseFloat(customFood.protein),
        amount: amount,
        unit: '克',
      };
    } else {
      foodItem = {
        ...selectedFood,
        amount: amount,
      };
    }

    const newRecord = { ...dietRecord };
    newRecord[selectedMealType].push(foodItem);
    
    await saveDietRecord(newRecord);
    
    setShowFoodModal(false);
    setShowCustomFoodModal(false);
    setCustomFood({
      name: '',
      calories: '',
      carbs: '',
      fat: '',
      protein: '',
      amount: '100',
    });
  };

  const onChartScroll = (event) => {
    const slideSize = screenWidth;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentChartIndex(roundIndex);
  };

  const renderCalorieChart = () => {
    const nutrition = calculateTotalNutrition();
    const remaining = dailyGoal - nutrition.calories + exerciseCalories;
    const consumed = nutrition.calories;
    const progress = Math.min(consumed / dailyGoal, 1);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>卡路里</Text>
        <Text style={styles.chartSubtitle}>剩餘 = 目標 - 食品 + 運動</Text>
        
        <View style={styles.calorieChartContent}>
          <View style={styles.circularChart}>
            <View style={[styles.progressCircle, { 
              borderColor: progress > 0.8 ? '#FF6B6B' : '#00CED1',
              borderTopWidth: 8,
              transform: [{ rotate: `${progress * 360}deg` }]
            }]} />
            <View style={styles.centerCircle}>
              <Text style={styles.remainingCalories}>{remaining.toLocaleString()}</Text>
              <Text style={styles.remainingLabel}>剩餘</Text>
            </View>
          </View>
          
          <View style={styles.calorieStats}>
            <View style={styles.statItem}>
              <Ionicons name="flag-outline" size={20} color="#00CED1" />
              <Text style={styles.statLabel}>基本目標</Text>
              <Text style={styles.statValue}>{dailyGoal.toLocaleString()}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="restaurant-outline" size={20} color="#4A90E2" />
              <Text style={styles.statLabel}>食品</Text>
              <Text style={styles.statValue}>{consumed}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="fitness-outline" size={20} color="#FF8C00" />
              <Text style={styles.statLabel}>運動</Text>
              <Text style={styles.statValue}>{exerciseCalories}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNutritionChart = () => {
    const nutrition = calculateTotalNutrition();
    
    const nutritionData = [
      {
        name: 'Carbohydrates',
        color: '#4ECDC4',
        current: nutrition.carbs,
        goal: nutritionGoals.carbs,
        unit: 'g'
      },
      {
        name: 'Fat', 
        color: '#9B59B6',
        current: nutrition.fat,
        goal: nutritionGoals.fat,
        unit: 'g'
      },
      {
        name: 'Protein',
        color: '#F39C12',
        current: nutrition.protein,
        goal: nutritionGoals.protein,
        unit: 'g'
      }
    ];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>營養攝取</Text>
        <Text style={styles.chartSubtitle}>每日營養素分解</Text>
        
        <View style={styles.nutritionChartContent}>
          {nutritionData.map((item, index) => (
            <View key={index} style={styles.nutritionItem}>
              <Text style={[styles.nutritionName, { color: item.color }]}>
                {item.name}
              </Text>
              
              <View style={styles.nutritionCircle}>
                <View style={[styles.nutritionProgress, {
                  borderColor: item.color,
                  borderTopWidth: 6,
                  borderRightWidth: item.current / item.goal > 0.25 ? 6 : 0,
                  borderBottomWidth: item.current / item.goal > 0.5 ? 6 : 0,
                  borderLeftWidth: item.current / item.goal > 0.75 ? 6 : 0,
                }]} />
                
                <View style={styles.nutritionCenter}>
                  <Text style={styles.nutritionCurrent}>{item.current}</Text>
                  <Text style={styles.nutritionGoal}>/{item.goal}{item.unit}</Text>
                </View>
              </View>
              
              <Text style={styles.nutritionRemaining}>
                {Math.max(0, item.goal - item.current)}{item.unit} left
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderWeeklyChart = () => {
    const chartData = {
      labels: weeklyData.map(item => item.day.replace('週', '')),
      datasets: [{
        data: weeklyData.map(item => item.calories),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(0, 206, 209, ${opacity})`,
      }]
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>本週卡路里</Text>
        <Text style={styles.chartSubtitle}>每日攝取趨勢</Text>
        
        <View style={styles.weeklyChartContent}>
          <LineChart
            data={chartData}
            width={screenWidth - 60}
            height={200}
            chartConfig={{
              backgroundColor: '#1C2526',
              backgroundGradientFrom: '#1C2526',
              backgroundGradientTo: '#1C2526',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 206, 209, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#00CED1"
              }
            }}
            bezier
            style={styles.lineChart}
          />
          
          <View style={styles.weeklyStats}>
            <Text style={styles.weeklyAverage}>
              週平均: {Math.round(weeklyData.reduce((sum, item) => sum + item.calories, 0) / weeklyData.length)} 卡路里
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderChartIndicators = () => (
    <View style={styles.chartIndicators}>
      {[0, 1, 2].map(index => (
        <View
          key={index}
          style={[
            styles.indicator,
            { backgroundColor: currentChartIndex === index ? '#00CED1' : '#4A5657' }
          ]}
        />
      ))}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setShowMealModal(true)}
      >
        <View style={styles.actionButtonIcon}>
          <Ionicons name="search" size={24} color="#4A90E2" />
        </View>
        <Text style={styles.actionButtonText}>記錄食品</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <View style={[styles.actionButtonIcon, { backgroundColor: '#FF6B6B' }]}>
          <Ionicons name="barcode-outline" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.actionButtonText}>條碼掃描</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMealSelectionModal = () => (
    <Modal visible={showMealModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>選擇餐點類型</Text>
          
          {[
            { key: 'breakfast', label: '早餐', icon: 'sunny-outline' },
            { key: 'lunch', label: '午餐', icon: 'partly-sunny-outline' },
            { key: 'dinner', label: '晚餐', icon: 'moon-outline' },
            { key: 'snacks', label: '點心', icon: 'cafe-outline' },
          ].map(meal => (
            <TouchableOpacity
              key={meal.key}
              style={styles.mealOption}
              onPress={() => {
                setSelectedMealType(meal.key);
                setShowMealModal(false);
                setShowFoodModal(true);
              }}
            >
              <Ionicons name={meal.icon} size={24} color="#00CED1" />
              <Text style={styles.mealOptionText}>{meal.label}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowMealModal(false)}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderFoodSelectionModal = () => {
    const filteredFoods = FOOD_DATABASE.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Modal visible={showFoodModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.foodModalContent}>
            <Text style={styles.modalTitle}>選擇食品</Text>
            
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋食品..."
              placeholderTextColor="#7A8B8D"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <ScrollView style={styles.foodList}>
              {filteredFoods.map(food => (
                <TouchableOpacity
                  key={food.id}
                  style={styles.foodItem}
                  onPress={() => addFood(food)}
                >
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodCalories}>{food.calories} 卡路里/{food.unit}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowFoodModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  setShowFoodModal(false);
                  setShowCustomFoodModal(true);
                }}
              >
                <Text style={styles.confirmButtonText}>自訂食品</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今天</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>修改</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onChartScroll}
        scrollEventThrottle={16}
        style={styles.chartsScrollView}
      >
        {renderCalorieChart()}
        {renderNutritionChart()}
        {renderWeeklyChart()}
      </ScrollView>

      {renderChartIndicators()}
      {renderActionButtons()}

      <View style={styles.recordingSection}>
        <Text style={styles.sectionTitle}>拍照記錄</Text>
        
        <View style={styles.recordingItems}>
          <TouchableOpacity style={styles.recordingItem}>
            <Ionicons name="scale-outline" size={24} color="#4ECDC4" />
            <Text style={styles.recordingItemText}>體重</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.recordingItem}>
            <Ionicons name="fitness-outline" size={24} color="#FF8C00" />
            <Text style={styles.recordingItemText}>運動</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderMealSelectionModal()}
      {renderFoodSelectionModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chartsScrollView: {
    height: 320,
  },
  chartContainer: {
    width: screenWidth,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#7A8B8D',
    textAlign: 'center',
    marginBottom: 20,
  },
  calorieChartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circularChart: {
    width: 160,
    height: 160,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#2C3E50',
    position: 'absolute',
  },
  centerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingCalories: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  remainingLabel: {
    fontSize: 14,
    color: '#7A8B8D',
  },
  calorieStats: {
    flex: 1,
    paddingLeft: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nutritionChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  nutritionCircle: {
    width: 80,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  nutritionProgress: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#2C3E50',
    position: 'absolute',
  },
  nutritionCenter: {
    alignItems: 'center',
  },
  nutritionCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nutritionGoal: {
    fontSize: 12,
    color: '#7A8B8D',
  },
  nutritionRemaining: {
    fontSize: 12,
    color: '#7A8B8D',
    textAlign: 'center',
  },
  weeklyChartContent: {
    alignItems: 'center',
  },
  lineChart: {
    borderRadius: 16,
    marginVertical: 10,
  },
  weeklyStats: {
    marginTop: 15,
    alignItems: 'center',
  },
  weeklyAverage: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  actionButtonIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recordingSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  recordingItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordingItem: {
    alignItems: 'center',
    flex: 1,
  },
  recordingItemText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  foodModalContent: {
    backgroundColor: '#2C3E50',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  mealOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5657',
  },
  mealOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  searchInput: {
    backgroundColor: '#4A5657',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  foodList: {
    maxHeight: 300,
  },
  foodItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5657',
  },
  foodName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  foodCalories: {
    fontSize: 14,
    color: '#7A8B8D',
    marginTop: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#4A5657',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#00CED1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#1C2526',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 