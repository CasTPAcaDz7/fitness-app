import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EventCard = ({ event, onPress, onDelete }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'workout':
        return 'dumbbell';
      case 'running':
        return 'run';
      case 'yoga':
        return 'yoga';
      case 'swimming':
        return 'pool';
      case 'cycling':
        return 'bike';
      case 'nutrition':
        return 'apple';
      default:
        return 'calendar-check';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'workout':
        return '#4A90E2';
      case 'running':
        return '#e74c3c';
      case 'yoga':
        return '#9b59b6';
      case 'swimming':
        return '#3498db';
      case 'cycling':
        return '#f39c12';
      case 'nutrition':
        return '#27ae60';
      default:
        return '#4A90E2';
    }
  };

  const formatTime = (date) => {
    if (!date) return '';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <View style={styles.eventHeader}>
        <View style={styles.eventIconContainer}>
          <MaterialCommunityIcons 
            name={getEventIcon(event.type)} 
            size={20} 
            color={getEventColor(event.type)} 
          />
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.time && (
            <Text style={styles.eventTime}>{formatTime(event.date)}</Text>
          )}
        </View>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <MaterialCommunityIcons name="delete" size={18} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
      
      {event.description && (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
      )}
      
      <View style={styles.eventFooter}>
        <View style={[styles.eventTypeTag, { backgroundColor: getEventColor(event.type) + '20' }]}>
          <Text style={[styles.eventTypeText, { color: getEventColor(event.type) }]}>
            {event.type === 'workout' ? '健身' :
             event.type === 'running' ? '跑步' :
             event.type === 'yoga' ? '瑜伽' :
             event.type === 'swimming' ? '游泳' :
             event.type === 'cycling' ? '騎車' :
             event.type === 'nutrition' ? '營養' : '其他'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#404040',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#4A90E2',
  },
  deleteButton: {
    padding: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
    marginLeft: 44,
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 44,
  },
  eventTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
  },
});

export default EventCard; 