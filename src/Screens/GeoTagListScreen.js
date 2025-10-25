import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Card, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllGeoTags } from "../utils/geoTagStorage";

function GeoTagListScreen(props) {
  const { navigation } = props;
  const [geoTags, setGeoTags] = React.useState([]);
  const [filteredTags, setFilteredTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    loadGeoTags();
  }, []);

  React.useEffect(() => {
    // Filter tags based on search
    if (searchQuery.trim() === "") {
      setFilteredTags(geoTags);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = geoTags.filter(
        (tag) => tag.name.toLowerCase().includes(query) || tag.hint.toLowerCase().includes(query)
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, geoTags]);

  async function loadGeoTags() {
    try {
      setLoading(true);
      const tags = await getAllGeoTags();
      // Sort by creation date (newest first)
      const sortedTags = tags.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGeoTags(sortedTags);
      setFilteredTags(sortedTags);
    } catch (error) {
      console.error("Error loading geo tags:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleTagPress(tag) {
    navigation.navigate("GeoTagSearch", { geoTag: tag });
  }

  function renderEmptyState() {
    if (loading) {
      return null;
    }

    if (geoTags.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Geo Tags Yet
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            There are no geo tags available to search for.
          </Text>
          <Text variant="bodyMedium" style={styles.emptyHint}>
            Ask an admin to create some geo tags!
          </Text>
        </View>
      );
    }

    if (filteredTags.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Results
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            No geo tags match "{searchQuery}"
          </Text>
        </View>
      );
    }

    return null;
  }

  function renderGeoTag({ item }) {
    return (
      <Card style={styles.card} onPress={() => handleTagPress(item)}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.tagName}>
            {item.name}
          </Text>
          <Text variant="bodyMedium" style={styles.tagHint}>
            {item.hint}
          </Text>
          <Text variant="labelSmall" style={styles.tagDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading Geo Tags...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Available Geo Tags
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Select a geo tag to start searching
        </Text>
      </View>

      {geoTags.length > 0 && (
        <Searchbar
          placeholder="Search by name or hint..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      )}

      <FlatList
        data={filteredTags}
        renderItem={renderGeoTag}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadGeoTags}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#666",
  },
  searchBar: {
    margin: 15,
    elevation: 2,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  tagName: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tagHint: {
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  tagDate: {
    color: "#999",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  emptyHint: {
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default GeoTagListScreen;
