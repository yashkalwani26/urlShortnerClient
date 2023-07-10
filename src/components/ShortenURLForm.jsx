import React, { useState, useRef } from 'react';
import { TextField, Button, Grid, Box, Container, Snackbar, Typography, Divider } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab'
import CopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';
//const urlShortnerService = process.env.SHORTNER_SERVICE || "https://901tx17pbl.execute-api.us-east-1.amazonaws.com/dev/api"

const ShortenURLForm = () => {
    const [longURL, setLongURL] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const textFieldRef = useRef(null);

    const handleCopy = () => {
        if (textFieldRef.current) {
            textFieldRef.current.select();
            navigator.clipboard.writeText(shortUrl);
            showSnackbar('copied to clipboard!')
        }
    };

    const handleReset = () => {
        setLongURL('')
        setShortUrl('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let response = await fetch(`/api`, {
            method: 'POST',
            body: JSON.stringify({ url: longURL }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        Promise.resolve()
            .then(async () => {
                let status = response.status
                let data = await response.json()
                console.log(data, "--", status)
                // Display the shortened URL or error message
                if (status === 200) {
                    setShortUrl(data.shortUrl)
                    console.log(shortUrl)
                    showSnackbar(data.shortUrl);
                } else {
                    showSnackbar('Error: Unable to shorten URL');
                }
            })
            .catch(() => {
                showSnackbar('Error: Unable to connect to the server');
            });
    };

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Grid>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Cloud Link Shortner
                </Typography>
            </Grid>
            <Divider />
            <Box component='form' onSubmit={handleSubmit} sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
                noValidate
                autoComplete="off">
                <Grid container spacing={8}>

                    <Grid item xs={10}>
                        <TextField
                            multiline
                            label="Original URL"
                            id="outlined-multiline-static"
                            fullWidth
                            value={longURL}
                            onChange={(e) => setLongURL(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Tooltip title="Reset">
                            <IconButton onClick={handleReset}>
                                <ReplaySharpIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            align="left"
                            onSubmit={handleSubmit}
                        >
                            Shorten
                        </Button>
                    </Grid>

                    {(shortUrl) ?
                        <>
                            <Grid item xs={10}>
                                <TextField
                                    multiline
                                    inputRef={textFieldRef}
                                    label="Short URL"
                                    id="outlined-multiline-static"
                                    fullWidth
                                    disabled
                                    value={shortUrl}
                                    onChange={(e) => setLongURL(e.target.value)}
                                />

                            </Grid>
                            <Grid item xs={2}>
                                <Tooltip title="Copy Short URL">
                                    <IconButton onClick={handleCopy}>
                                        <CopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </> : <></>
                    }
                </Grid>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={closeSnackbar}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={closeSnackbar}
                    severity="success"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default ShortenURLForm;
