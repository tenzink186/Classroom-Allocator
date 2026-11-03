import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "classfind_recent_searches";

export async function saveRecentSearch(classroom) {
  const oldItems = JSON.parse((await AsyncStorage.getItem(KEY)) || "[]");
  const updated = [classroom, ...oldItems.filter((item) => item.id !== classroom.id)].slice(0, 8);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getRecentSearches() {
  return JSON.parse((await AsyncStorage.getItem(KEY)) || "[]");
}
