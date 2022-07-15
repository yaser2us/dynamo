/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { FormBuilderV4 } from "dynamo";

const sample110 = {
  root: {
    name: "root",
    items: ["YReB8ij6Oko", "ttttttt", "submit", "label"],
    visible: true,
  },
  YReB8ij6Oko: {
    id: "YReB8ij6Oko",
    type: "text",
    name: "YReB8ij6Oko",
    label: "Hi i am here ;)",
    value: "",
    visible: true,
    watch: true
  },
  ttttttt: {
    id: "ttttttt",
    type: "text",
    name: "ttttttt",
    label: "ttttttt ;)",
    value: "",
    visible: true
  },
  label: {
    id: "label",
    type: "label",
    name: "label",
    label: "YReB8ij6Oko",
    value: "",
    visible: true
  },
  submit: {
    id: "submit",
    type: "button",
    name: "submit",
    label: "YReB8ij6Oko",
    value: "",
    visible: true
  }
};

const Section = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  //Access to form
  const myForm = useRef({});
  //Form elements
  // const [items, setItems] = useState(sample);
  const [items, setItems] = useState(sample110);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const newComponents = {
    text: (props) => {
      const { value, onChange } = props.field;

      const onChangeText = (value) => {
        console.log(value, "onChangeText")
        onChange(value);
      }
      return (<View><Text>{props.item.label}</Text>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
          }}
          onChangeText={onChangeText}
          value={value}
          {...props.fields} />
      </View>)
    },
    // text: (props) => <TextInput {...props} />,
    // checkbox: (props) => <Checkbox {...props} />,
    // switch: (props) => <Switch {...props} />,
    // select: (props) => <Dropdown {...props} />,
    button: (props) => {
      
      const { getValues } = props.sharedItems;
      const label = getValues(props.item.label);
      const onPress = () => {
        console.log(label,getValues(props.item.label),'ppppppp');
      }

      return(<Button
      title={label}
      onPress={onPress}
      // onPress={() => props.managedCallback(props.item)}
    />)},

    buttonL: (props) => <View onPress={props.managedCallback} {...props}><Text>{props.item.label}</Text></View>,
    // fieldset: (props) => <Fieldset {...props} />,
    // // fieldset: (props) => <LocalPagination {...props} />,
    label: (props) => {

      const { getValues } = props.sharedItems;
      const label = getValues(props.item.label);
      return (
        <View
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
          }}>
          <Text>{label} - from here ;</Text>
        </View>
      )
    },
    // confirmationButton: (props) => <ConfirmationButton {...props} />,
    // asyncBlock: (props) => <AsyncBlock {...props} />,
    '': (props) => (
      <View>
        <Text>
          {JSON.stringify(props.item, null, 2)}
        </Text>
      </View>
    ),
  };

  const renderContainer = (children) => (
    <View style={{ flex: 1 }}>
      {children}</View>
  );

  const renderComponent = (type, propsItems) => {
    const selectedComponent =
      (newComponents && newComponents[type]) || newComponents[""];
    // if (selectedComponent === undefined) return null;
    console.log(type);
    if (type === "button") {
      return selectedComponent({ ...propsItems });
    }

    return renderContainer(selectedComponent({ ...propsItems }));
  };
  const validationResolver = {
    noteq: async (item, value) => {
      console.log(
        !(value === item.value),
        value,
        item,
        "noteqeq",
        item.value.includes(value),
        value === ""
      );
      return !(value === item.value);
      // return (value !== "" && !item.value.includes(value)) || false;
    },
    eq: async (item, value) => {
      console.log(item, value, "eqeqeq");
      return value === item.value;
    },
    exist: async (item, value) => {
      console.log(item, value, "exist");
      return value !== "";
    },
    eq1: async (item, value) => {
      return (value !== "" && item.value.includes(value)) || false;
    },
  };

  const managedCallback = async ({ item, actionType = "partial" }) => {
    const formData = await myForm.current.getValues();
    console.log(formData, 'formDataaaaaaa')

  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {items && (
            <FormBuilderV4
              devMode={false}
              key={`dynamo-${items.length}`}
              name={`dynamo-${items.length}`}
              ref={myForm}
              items={items}
              defaultValues={
                {
                  "YReB8ij6Oko": "llllllllol"
                }
              }
              components={renderComponent}
              managedCallback={managedCallback}
              validationResolver={validationResolver}
            />
          )}
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
