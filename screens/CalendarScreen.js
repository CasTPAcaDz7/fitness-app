import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 中文星期標籤
  const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];

  // 獲取月份的所有日期
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月份的第一天
    const firstDay = new Date(year, month, 1);
    
    // 計算日曆開始日期（包含上個月的日期）
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 生成6週的日期（42天）
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // 檢查是否為今天
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // 檢查是否為當前月份
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // 檢查是否為週末
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // 切換月份
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // 回到今天
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 格式化月份日期顯示
  const formatMonthDay = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 處理日期點擊
  const handleDatePress = (date) => {
    console.log('日期點擊:', formatMonthDay(date));
  };

  // 渲染日期單元格
  const renderDateCell = (date, index) => {
    const today = isToday(date);
    const currentMonth = isCurrentMonth(date);
    const weekend = isWeekend(date);

    return (
      <TouchableOpacity
        key={index}
        style={styles.dateCell}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.8}
      >
        <View style={styles.dateCellContent}>
          {/* 主日期數字 */}
          <Text style={[
            styles.dateText,
            !currentMonth && styles.otherMonthText,
            (today || weekend) && styles.highlightText
          ]}>
            {date.getDate()}
          </Text>
          
          {/* 月/日 輔助信息 */}
          <Text style={[
            styles.monthDayText,
            !currentMonth && styles.otherMonthTextSecondary
          ]}>
            {formatMonthDay(date)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* 頂部標題欄 */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar" size={22} color="#ffffff" />
          </View>
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              style={styles.monthSelector}
              onPress={goToToday}
            >
              <Text style={styles.yearMonthText}>
                {currentDate.getFullYear()}年{months[currentDate.getMonth()]}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#888888" />
            </TouchableOpacity>
            <Text style={styles.subtitleText}>行事曆</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => changeMonth(-1)}
          >
            <MaterialCommunityIcons name="star-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => changeMonth(1)}
          >
            <MaterialCommunityIcons name="message-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 星期標籤 */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 日曆網格 - 精確匹配截圖 */}
      <View style={styles.calendarGrid}>
        {getMonthDays().map((date, index) => renderDateCell(date, index))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#000000',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#2d8659',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearMonthText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 3,
  },
  subtitleText: {
    fontSize: 11,
    color: '#888888',
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 6,
    marginLeft: 6,
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 8,
    marginTop: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  weekDayText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  calendarGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#000000',
    paddingTop: 2,
  },
  dateCell: {
    width: screenWidth / 7,
    height: screenWidth / 7 * 0.85,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dateCellContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 1,
  },
  monthDayText: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '400',
  },
  otherMonthText: {
    color: '#444444',
  },
  otherMonthTextSecondary: {
    color: '#333333',
  },
  highlightText: {
    color: '#ff4444',
  },
}); 