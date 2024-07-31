import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import AdminHeader from '../../Header';
import { Context } from '../../../..';

const AdminDashboard = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        console.log(store.user);
    }, [store.user]);

    const cardStyle1 = { backgroundColor: '#e3f2fd', marginBottom: '1rem' };
    const cardStyle2 = { backgroundColor: '#ffebee', marginBottom: '1rem' };
    const cardStyle3 = { backgroundColor: '#e8f5e9', marginBottom: '1rem' };

    return (
        <>
            <AdminHeader />
            <Container style={{ marginTop: '2rem' }}>
                <Row className="my-4 justify-content-center">
                    <Col md={4}>
                        <Card style={cardStyle1}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Информация о вас
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Имя: {store.user.secondName} {store.user.firstName} {store.user.patronomicName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email: {store.user.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Телефон: {store.user.phone}
                                </Typography>
                                <Button>Настройки</Button>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card style={cardStyle2}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Информация по приложению
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Памятка" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Требования к аппаратному обеспечению" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Инструкция (PDF)" />
                                        <Button variant="contained" color="primary" href="/path/to/instruction.pdf" download>
                                            Скачать
                                        </Button>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card style={cardStyle3}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Дополнительная информация
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Здесь можно разместить другую важную информацию, такую как новости, обновления, или советы по использованию приложения.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminDashboard;
