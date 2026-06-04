import { Box, Center } from "@chakra-ui/react"
import { Avatar, Badge, Float } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"

const AvatarDemo = () => {
    return (
        <Box display="inline-block" pos="relative">
            <Avatar.Root size="lg" shape="rounded">
                <Avatar.Image src="https://bit.ly/dan-abramov" />
                <Avatar.Fallback />
            </Avatar.Root>
            <Float placement="bottom-end">
                <Badge size="sm" variant="solid" colorPalette="teal">
                    New
                </Badge>
            </Float>
        </Box>
    )
}


export const TopBarDemo = () => (
    <Box padding={2} position={"sticky"} top={0} bg="black" zIndex={1} boxShadow="sm" borderWidth="5px">
        <Box paddingLeft={10}>
            <Text fontSize="15px">Hello World!</Text>
            <Text color="green" fontSize="30px">Senshu's Demo Web site</Text>
        </Box>
        <Box right={10} position={"absolute"} top={5}>
            <AvatarDemo />
        </Box>
    </Box>
)



export default TopBarDemo;