import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (
  key: string,
  value: any,
) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch (error) {
    console.log(error);
  }
};

export const getData = async (
  key: string,
) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value);
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};