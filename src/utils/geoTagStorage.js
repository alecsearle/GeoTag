import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAllGeoTagIds() {
  try {
    const existingIds = await AsyncStorage.getItem("geotag_ids");
    return existingIds ? JSON.parse(existingIds) : [];
  } catch (error) {
    console.error("Error getting geo tag IDs:", error);
    return [];
  }
}

export async function getGeoTag(geoTagId) {
  try {
    const storedData = await AsyncStorage.getItem(`geotag_${geoTagId}`);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error getting geo tag:", error);
    return null;
  }
}

export async function getAllGeoTags() {
  try {
    const ids = await getAllGeoTagIds();
    const geoTags = await Promise.all(ids.map((id) => getGeoTag(id)));
    return geoTags.filter((tag) => tag !== null);
  } catch (error) {
    console.error("Error getting all geo tags:", error);
    return [];
  }
}

export async function deleteGeoTag(geoTagId) {
  try {
    // Remove from storage
    await AsyncStorage.removeItem(`geotag_${geoTagId}`);

    // Remove from ID list
    const existingIds = await getAllGeoTagIds();
    const updatedIds = existingIds.filter((id) => id !== geoTagId);
    await AsyncStorage.setItem("geotag_ids", JSON.stringify(updatedIds));

    return true;
  } catch (error) {
    console.error("Error deleting geo tag:", error);
    return false;
  }
}

export async function clearAllGeoTags() {
  try {
    const ids = await getAllGeoTagIds();
    await Promise.all(ids.map((id) => AsyncStorage.removeItem(`geotag_${id}`)));
    await AsyncStorage.removeItem("geotag_ids");
    return true;
  } catch (error) {
    console.error("Error clearing all geo tags:", error);
    return false;
  }
}
