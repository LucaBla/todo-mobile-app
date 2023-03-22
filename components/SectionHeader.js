import { View, Text, StyleSheet } from "react-native";

const SectionHeader = ({title}) => {

  const getDate = () =>{
    if(title === "anytime"){
      return "anytime"
    }
    let date = new Date(Date.parse(title))
    let today = new Date()
    let tomorrow = new Date()
    let yesterday = new Date()

    tomorrow.setDate(today.getDate() + 1)
    yesterday.setDate(today.getDate() - 1)

    console.log(date.getDate())

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
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{getDate()}</Text>
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
  sectionHeader:{
    backgroundColor: '#1B1E23',
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