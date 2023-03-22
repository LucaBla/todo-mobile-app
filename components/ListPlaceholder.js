import { View, Text, StyleSheet } from "react-native";

const ListPlaceholder = () => {

  return(
    <View style={styles.listPlaceholder}>
      <Text style={styles.sectionTitle}>Time to get to work, but first... time to make a ToDo list!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle:{
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  listPlaceholder:{
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
})

export default ListPlaceholder;