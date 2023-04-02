import { View, Text, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons'; 

const SectionHeader = ({title, expandedSections}) => {

  const getDate = () =>{
    if(title === "anytime"){
      return "anytime"
    }

    let date = new Date(title)
    let today = new Date()
    let tomorrow = new Date()
    let yesterday = new Date()

    if(today.getHours() >= 22){
      date.setDate(today.getDate() + 1)
    }

    tomorrow.setDate(today.getDate() + 1)
    yesterday.setDate(today.getDate() - 1)

    if(date.toDateString() === today.toDateString()){
      return "today"
    }
    else if(date.toDateString() === tomorrow.toDateString()){
      return "tomorrow"
    }
    else if(date.toDateString() === yesterday.toDateString()){
      return "yesterday"
    }
    return date.getDate() + '.' + parseInt(date.getMonth()+1) + '.' + date.getFullYear()
  }

  return(
    <View style={styles.sectionHeaderWrapper}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{getDate()}</Text>
        {expandedSections.includes(title) ? (
          <Feather name="chevron-up" size={24} color="white" />
        ) : (
          <Feather name="chevron-down" size={24} color="white" />
        )

        }
      </View>
      <View style={styles.borderBottom}/>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle:{
    color: 'white',
    fontSize: 20,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  sectionHeaderWrapper:{
    backgroundColor: '#1B1E23',
  },
  sectionHeader:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 20
  },
  borderBottom:{
    borderBottomColor: '#262A30',
    borderBottomWidth: 3,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  }
})

export default SectionHeader;