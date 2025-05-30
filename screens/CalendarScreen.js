import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useFirebase';
import { firestoreService, checkFirebaseServices } from '../services/firebaseService';
import EventCard from '../components/EventCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CalendarScreen() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('workout');
  const [firebaseAvailable, setFirebaseAvailable] = useState(true);

  // 中文星期標籤
  const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  // 事件類型選項
  const eventTypes = [
    { id: 'workout', name: '健身', icon: 'dumbbell', color: '#4A90E2' },
    { id: 'running', name: '跑步', icon: 'run', color: '#e74c3c' },
    { id: 'yoga', name: '瑜伽', icon: 'yoga', color: '#9b59b6' },
    { id: 'swimming', name: '游泳', icon: 'pool', color: '#3498db' },
    { id: 'cycling', name: '騎車', icon: 'bike', color: '#f39c12' },
    { id: 'nutrition', name: '營養', icon: 'apple', color: '#27ae60' },
  ];

  // 檢查 Firebase 服務狀態
  useEffect(() => {
    const services = checkFirebaseServices();
    setFirebaseAvailable(services.firestore && services.auth);
    
    if (!services.firestore) {
      console.warn('⚠️  Firestore 不可用，將使用本地模式');
    }
    if (!services.auth) {
      console.warn('⚠️  Auth 不可用，將使用模擬模式');
    }
  }, []);

  // 載入事件數據
  useEffect(() => {
    if (user && firebaseAvailable) {
      loadEvents();
    } else if (!firebaseAvailable) {
      // 使用模擬數據進行演示
      setEvents([
        {
          id: 'demo1',
          title: '晨間瑜伽',
          description: '放鬆身心的瑜伽練習',
          date: new Date(),
          type: 'yoga',
          userId: 'demo'
        },
        {
          id: 'demo2',
          title: '力量訓練',
          description: '上半身肌肉訓練',
          date: new Date(Date.now() + 86400000), // 明天
          type: 'workout',
          userId: 'demo'
        }
      ]);
    }
  }, [user, currentDate, firebaseAvailable]);

  const loadEvents = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const eventsData = await firestoreService.getCollection('calendar_events', {
        where: ['userId', '==', user?.uid],
        orderBy: ['date', 'asc']
      });
      
      // 過濾當前月份的事件
      const monthEvents = eventsData.filter(event => {
        const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
        return eventDate >= startOfMonth && eventDate <= endOfMonth;
      });
      
      setEvents(monthEvents);
    } catch (error) {
      console.error('載入事件失敗:', error);
      Alert.alert(
        '載入失敗',
        '無法載入日曆事件，請檢查網絡連接或稍後再試',
        [{ text: '確定' }]
      );
    }
  };

  // 獲取月份的所有日期
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月份的第一天和最後一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
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

  // 獲取日期的事件
  const getDateEvents = (date) => {
    return events.filter(event => {
      const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
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

  // 處理日期點擊
  const handleDatePress = (date) => {
    setSelectedDate(date);
    const dateEvents = getDateEvents(date);
    if (dateEvents.length > 0) {
      setModalVisible(true);
    } else {
      if (firebaseAvailable && user) {
        setEventModalVisible(true);
      } else {
        Alert.alert(
          '功能不可用',
          firebaseAvailable ? '請先登入以添加事件' : 'Firebase 服務不可用，無法添加事件',
          [{ text: '確定' }]
        );
      }
    }
  };

  // 添加新事件
  const addEvent = async () => {
    if (!newEventTitle.trim()) {
      Alert.alert('錯誤', '請輸入事件標題');
      return;
    }

    if (!firebaseAvailable) {
      Alert.alert('錯誤', 'Firebase 服務不可用，無法保存事件');
      return;
    }

    if (!user) {
      Alert.alert('錯誤', '請先登入');
      return;
    }

    try {
      await firestoreService.addDocument('calendar_events', {
        userId: user.uid,
        title: newEventTitle,
        description: newEventDescription,
        date: selectedDate,
        type: selectedEventType
      });

      setNewEventTitle('');
      setNewEventDescription('');
      setSelectedEventType('workout');
      setEventModalVisible(false);
      loadEvents();
      Alert.alert('成功', '事件已添加');
    } catch (error) {
      console.error('添加事件失敗:', error);
      Alert.alert('錯誤', '添加事件失敗：' + error.message);
    }
  };

  // 刪除事件
  const deleteEvent = async (eventId) => {
    if (!firebaseAvailable) {
      Alert.alert('錯誤', 'Firebase 服務不可用，無法刪除事件');
      return;
    }

    Alert.alert(
      '確認刪除',
      '確定要刪除這個事件嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '刪除',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestoreService.deleteDocument('calendar_events', eventId);
              loadEvents();
              Alert.alert('成功', '事件已刪除');
            } catch (error) {
              console.error('刪除事件失敗:', error);
              Alert.alert('錯誤', '刪除事件失敗：' + error.message);
            }
          }
        }
      ]
    );
  };

  // 渲染日期單元格
  const renderDateCell = (date, index) => {
    const dateEvents = getDateEvents(date);
    const hasEvents = dateEvents.length > 0;
    const today = isToday(date);
    const currentMonth = isCurrentMonth(date);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        style={[
          styles.dateCell,
          today && styles.todayCell,
          !currentMonth && styles.otherMonthCell
        ]}
        onPress={() => handleDatePress(date)}
        activeOpacity={0.7}
      >
        <View style={styles.dateCellContent}>
          <Text style={[
            styles.dateText,
            today && styles.todayText,
            !currentMonth && styles.otherMonthText
          ]}>
            {date.getDate()}
          </Text>
          {hasEvents && (
            <View style={styles.eventIndicator}>
              <View style={styles.eventDot} />
              {dateEvents.length > 1 && (
                <Text style={styles.eventCount}>{dateEvents.length}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Firebase 狀態指示器 */}
      {!firebaseAvailable && (
        <View style={styles.statusBar}>
          <MaterialCommunityIcons name="cloud-off" size={16} color="#f39c12" />
          <Text style={styles.statusText}>離線模式 - 部分功能受限</Text>
        </View>
      )}

      {/* 標題欄 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => changeMonth(-1)}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthTitleContainer}
          onPress={goToToday}
        >
          <Text style={styles.monthTitle}>
            {currentDate.getFullYear()}年{months[currentDate.getMonth()]}
          </Text>
          <Text style={styles.todayHint}>點擊回到今天</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => changeMonth(1)}
        >
          <MaterialCommunityIcons name="chevron-right" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 星期標籤 */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={[
              styles.weekDayText,
              (index === 0 || index === 6) && styles.weekendText
            ]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 日曆網格 */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarGrid}>
          {getMonthDays().map((date, index) => renderDateCell(date, index))}
        </View>
      </View>

      {/* 事件詳情模態框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate?.getFullYear()}年{selectedDate?.getMonth() + 1}月{selectedDate?.getDate()}日
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.eventsList}>
              {selectedDate && getDateEvents(selectedDate).map((event, index) => (
                <EventCard
                  key={event.id || index}
                  event={event}
                  onPress={() => {}}
                  onDelete={firebaseAvailable ? () => deleteEvent(event.id) : null}
                />
              ))}
            </ScrollView>
            
            {firebaseAvailable && user && (
              <TouchableOpacity 
                style={styles.addEventButton}
                onPress={() => {
                  setModalVisible(false);
                  setEventModalVisible(true);
                }}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#ffffff" />
                <Text style={styles.addEventButtonText}>添加事件</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 添加事件模態框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => setEventModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                添加事件 - {selectedDate?.getMonth() + 1}月{selectedDate?.getDate()}日
              </Text>
              <TouchableOpacity onPress={() => setEventModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>事件類型</Text>
              <ScrollView horizontal style={styles.eventTypeContainer} showsHorizontalScrollIndicator={false}>
                {eventTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.eventTypeButton,
                      selectedEventType === type.id && { backgroundColor: type.color + '30' }
                    ]}
                    onPress={() => setSelectedEventType(type.id)}
                  >
                    <MaterialCommunityIcons 
                      name={type.icon} 
                      size={20} 
                      color={selectedEventType === type.id ? type.color : '#888888'} 
                    />
                    <Text style={[
                      styles.eventTypeButtonText,
                      { color: selectedEventType === type.id ? type.color : '#888888' }
                    ]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <Text style={styles.inputLabel}>事件標題</Text>
              <TextInput
                style={styles.textInput}
                value={newEventTitle}
                onChangeText={setNewEventTitle}
                placeholder="例如：健身訓練、跑步..."
                placeholderTextColor="#888888"
              />
              
              <Text style={styles.inputLabel}>事件描述</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={newEventDescription}
                onChangeText={setNewEventDescription}
                placeholder="詳細描述（可選）"
                placeholderTextColor="#888888"
                multiline
                numberOfLines={3}
              />
              
              <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
                <Text style={styles.saveButtonText}>保存事件</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#f39c12',
  },
  statusText: {
    color: '#f39c12',
    fontSize: 12,
    marginLeft: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  navButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#222222',
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  todayHint: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingVertical: 12,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    color: '#cccccc',
  },
  weekendText: {
    color: '#ff6b6b',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#000000',
  },
  dateCell: {
    width: screenWidth / 7,
    height: screenWidth / 7,
    borderWidth: 0.5,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  dateCellContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#ff3333',
  },
  otherMonthCell: {
    backgroundColor: '#0a0a0a',
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  todayText: {
    color: '#ffffff',
  },
  otherMonthText: {
    color: '#555555',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A90E2',
  },
  eventCount: {
    fontSize: 10,
    color: '#4A90E2',
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: '#ffffff',
    flex: 1,
  },
  eventsList: {
    maxHeight: 300,
  },
  addEventButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addEventButtonText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
  formContainer: {
    paddingVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 12,
  },
  eventTypeContainer: {
    marginBottom: 10,
  },
  eventTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#333333',
  },
  eventTypeButtonText: {
    fontSize: 12,
    marginLeft: 6,
  },
  textInput: {
    backgroundColor: '#222222',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
}); 