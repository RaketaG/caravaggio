import { Text, Pressable, StyleSheet } from "react-native";

type BlueButtonProps = {
    label: string;
    onPress?: () => void;
    color?: string;
    marginTop?: number;
    marginBottom?: number;
}

export const TextButton = ({ label, onPress, color, marginTop, marginBottom}: BlueButtonProps) => {
    return(
        <Pressable
            style={{
                marginTop: marginTop ?? 0,
                marginBottom: marginBottom ?? 0,
            }}
            onPress={onPress}
        >
            {({ pressed }) => (
                <Text
                    style={[
                        styles.createOneButtonText,
                        color && { color: color },
                        pressed && styles.createOneButtonTextPressed,
                    ]}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    createOneButtonText: {
        color: "#007AFF",
        fontWeight: "400",
        fontSize: 16
    },
    createOneButtonTextPressed: {
        opacity: 0.6
    },
});
