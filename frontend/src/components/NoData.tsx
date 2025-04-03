import { Alert } from '@mui/material'
import { WarningSharp } from '@mui/icons-material';

export default function NoData(props: { message?: string }) {
    const { message } = props
    return (
        <Alert icon={<WarningSharp fontSize="inherit" />} severity="success">
            {message ?? "Here is a gentle confirmation that your action was successful."}
        </Alert>
    )
}
