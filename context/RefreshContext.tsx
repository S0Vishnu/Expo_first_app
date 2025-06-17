import React, { useState, ReactNode } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { useData } from './DataContext';

interface RefreshGestureContextProps {
  children?: ReactNode; // Allows children to be of any valid React node type
}

const RefreshGestureContext: React.FC<RefreshGestureContextProps> = ({
  children,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { loadData } = useData();

  const refreshHandler = async () => {
    setRefreshing(true);
    try {
      await loadData(); // Call the context's loadData function
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />
      }
    >
      <View>{children}</View>
    </ScrollView>
  );
};

export default RefreshGestureContext;
