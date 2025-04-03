import { Box, Typography } from "@mui/material";

export interface IUser {
    email: string,
    first_name: string,
    last_name: string,
    username: string,
    groups: string[],

}
export const mockUser: IUser = {
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    groups: ["admin", "user"],
};

interface userProps {
    user?: IUser
}

export default function User(props?: userProps) {
    const { email, first_name, last_name, username } = props?.user ?? mockUser
    return (
        <Box display="flex" borderRadius={1} flexDirection="column" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5">
            <Typography variant="h6" component="div" gutterBottom>
                {first_name} {last_name}
            </Typography>
            <Typography >
                Username: {username}
            </Typography>
            <Typography >
                Email: {email}
            </Typography>
        </Box>
    )
}
