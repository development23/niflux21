import React from "react";
import { HStack, View, Text, useColorModeValue } from "native-base";
import tw from "tailwind-react-native-classnames";
import { TouchableOpacity } from "react-native";

export default function Radio({ data, selectedType }) {
  const [isSelected, setSelectedType] = selectedType;
  return (
    <HStack style={tw`mt-4 flex-wrap`} space={3}>
      {data.map((item, index) => (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor:
              isSelected == item.value ? "#FD7767" : "transparent",
            borderRadius: 30,
            borderWidth: 1,
            borderColor: useColorModeValue("#ddd", "#f7f7f7"),
            marginBottom: 10,
          }}
          key={item.id}
          onPress={() => setSelectedType(item.value)}
        >
          <Text
            style={{
              fontFamily: "nunito",
              color:
                isSelected == item.value
                  ? "#fff"
                  : useColorModeValue("#3E3E3E", "#f7f7f7"),
              fontSize: 18,
            }}
          >
            {item.value}
          </Text>
        </TouchableOpacity>
      ))}
    </HStack>
  );
}
