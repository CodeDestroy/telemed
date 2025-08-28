import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import AdminHeader from '../../Header';
import { Context } from '../../../..';

const DoctorDashboard = () => {
    const { store } = useContext(Context);

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
                                <Button disabled={true}>Настройки</Button>
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
                                        <ListItemText primary="Инструкция (PDF)" />
                                        <Button disabled={true} href="/path/to/instruction.pdf" download>
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
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card style={cardStyle2}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Требования к программному и аппаратному обеспечению
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Минимальные требования:" primaryTypographyProps={{fontSize: '17px', fontWeight: 'bold'}}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Операционная система: Windows 7+, macOS 10.12+, Linux (современные дистрибутивы)" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Браузер: Современные версии Chrome, Firefox, Safari, Edge" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Процессор: Двухъядерный процессор" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Оперативная память: 4 ГБ" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Сеть: Широкополосное соединение с минимальной скоростью 5 Мбит/с для видео 720p" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Рекомендуемые требования:" primaryTypographyProps={{fontSize: '17px', fontWeight: 'bold'}}/>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Операционная система: Windows 10, macOS 10.15+, Linux (современные дистрибутивы)" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Браузер: Последние версии Chrome, Firefox, Safari, Edge" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Процессор: Четырехъядерный процессор" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Оперативная память: 8 ГБ" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Сеть: Широкополосное соединение с минимальной скоростью 10 Мбит/с для устойчивого видео 720p" />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default DoctorDashboard;
