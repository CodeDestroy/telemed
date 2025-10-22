import React, {useState, useContext, useLayoutEffect, useEffect} from 'react'
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { Container, Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";


const SelectProfile = () => {
    const {store} = useContext(Context)

    
    // пока данные захардкожены, позже можно подставить из store
    const [profiles, setProfiles] = useState([])
    useEffect(() => {
        
        if (store && store.profiles && !store.isSelected && store.mustSelect) {
            console.log(store)
            setProfiles(store.profiles)
        }
            
    }, [store])
    const handleLogout = async () => {
        await store.logout()
        store.checkAuth()

    } 

    const handleSelectProfile = async (profile) => {
        store.setSelectedProfile(profile)
        store.isSelected = true
        store.mustSelect = false
        store.checkAuth()

    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#f5f5f5",
                p: 2,
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ mb: 4, fontWeight: 600 }}
                >
                    Выберите профиль для входа
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {profiles.map((profile) => (
                        <Grid item xs={12} sm={6} md={4} key={profile.id}>
                            <Card
                                sx={{
                                    minHeight: 160,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    textAlign: "center",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                                }}
                            >
                                <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {profile.MedicalOrg.medOrgName}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {profile.Posts.map(post => (
                                        <>
                                            <br></br>
                                            <span key={`${profile.id}_${post.postName}`}>{post.postName}</span>
                                        </>
                                            
                                        )
                                    )}
                                    
                                </Typography>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, borderRadius: 2 }}
                                    fullWidth
                                    onClick={() => handleSelectProfile(profile)}
                                >
                                Выбрать
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                    { store.user && !store.user.isWorker &&
                    <Grid item xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    minHeight: 160,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    textAlign: "center",
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                                }}
                            >
                                <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Войти как пациент
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Войдите в свой личный кабинет как пациент
                                    
                                </Typography>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, borderRadius: 2 }}
                                    fullWidth
                                    onClick={window.href = 'https://dr.clinicode.ru'}
                                >
                                Войти
                                </Button>
                            </Card>
                        </Grid>
                    }
                </Grid>

                {/* Кнопка Выйти */}
                <Box textAlign="center" mt={6}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleLogout}
                        sx={{ px: 4, borderRadius: 2 }}
                    >
                        Выйти
                    </Button>
                </Box>
            </Container>
        </Box>
  );
};

export default observer(SelectProfile);
