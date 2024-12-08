import './Itinerary.css';
import React, { Component } from 'react';
import { Row, Col, Card, Accordion, Container, Modal, Form, Button, Image, ListGroup, Option } from 'react-bootstrap';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';


// function AvatarList(memberList) {
//     const members = memberList.memberList;
//     console.log('Members: ', members);
//     return (
//         <Container id='listtaaa' style={styles.avatarList}>
//             {
//                 members.map((member, index) => (
//                     <Image key={index} roundedCircle src={member.profilePic} alt="profile" style={styles.avatar}></Image>
//                 ))
//             }
//         </Container>
//     );
// };

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    avatarList: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    avatar: {
        height: 35,
        width: 35,
        marginRight: -20,
        borderRadius: 25,
        borderWidth: 2,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        objectFit: 'cover'
    },
};

function Day(info) {


    const obj = info.info;
    const date = obj[0];
    const itineraryActivities = obj[1];
    const members = info.users;

    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editState, setEditState] = useState(t('edit'));

    const [show, setShow] = useState(false);
    const [activityName, setActivityName] = useState('');
    const [time, setTime] = useState('');
    const [activity, setActivity] = useState(null);
    const [activities, setActivities] = useState([]);


    const handleClose = () => setShow(false);
    const handleShow = async () => setShow(true);

    const getActID = (name) => {
        for (let i = 0; i < activities.length; i++) {
            console.log(activities[i].name, activities[i].id);
            if (activities[i].name === name) {
                console.log('found');
                return activities[i].id;
            }
        }
        return activity.id;
    }


    const formatDate = (date, language) => {
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        };

        const adjustedDate = new Date(date);
        adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());

        const formattedDate = new Intl.DateTimeFormat(language, options).format(adjustedDate);
        return formattedDate.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };


    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };


    const handleEdit = () => {
        setEditing(!editing);
        setEditState(editing ? t('edit') : t('save'));

        if (editing) fetchData();
    }

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };
    
    const handleSave = async () => {


        const apiLink = "http://localhost:3000/api/v1/";

        const itA = await fetch(apiLink + "itinerary-activity/", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
            date: date,
            time: time,
            activity: getActID(activityName),
            addedBy: localStorage.getItem('userID')
            }),
        })
            .then(async response => {
            let rta = await response.json();
            if (!response.ok) {
                throw new Error(rta.message);
            }
            return rta;
            })
            .then(async data => {
            console.log('Data', data);
            return data;
            })
            .catch(error => {
            console.error('Fetch error:', error);
            alert(error.message);
            });

        fetch(apiLink + "itinerary/" + info.itineraryID + "/itinerary-activity/" + itA.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(async response => {
            let rta = await response.json();
            console.log('Code', rta);
            if (!response.ok) {
                throw new Error(rta.message);
            }
            alert('Event updated successfully');
            return rta;
        }).then(async data => {
        }).catch(error => {
            console.error('Fetch error:', error);
            alert(error.message);
        });


        handleClose();

    }

    const fetchData = async () => {
        try {
            const response2 = await fetch("http://localhost:3000/api/v1/activity",
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (!response2.ok) {
                throw new Error("Network response was not ok");
            }
            const data2 = await response2.json();
            setActivities(data2);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    useEffect(() => {

        if (activities.length === 0) {
            fetchData();
        }
    });

    return (
        <>
            <Accordion.Item className="accItem" eventKey="0">
                <Accordion.Header className="accHeader" onClick={toggleAccordion} styles={{ verticalAlign: 'middle' }}>
                    <Row style={{ minWidth: '100%' }}>
                        <Col xs={10} md={11} lg={11} style={{ fontFamily: 'Volkhov', minWidth: 'fit-content' }}>
                            {formatDate(date, i18n.language)}
                        </Col>
                    </Row>
                </Accordion.Header>
                <Accordion.Body className="accBody">
                    <Row style={{ minWidth: '100%', justifyContent: 'end', padding: 0 }}>
                        <Col style={{ display: 'flex', justifyContent: 'flex-end' }} className='ml-auto' xs={2} md={2} lg={2}>
                            <button onClick={handleEdit} className='ml-auto' style={{ marginBottom: 0, color: 'var(--naranja)', fontWeight: '650', background: 'none', border: 'none', fontSize: 'small' }}> {editState} </button>
                        </Col>
                    </Row>
                    <div className="event mb-4" >
                        {
                            itineraryActivities.map((event, index) => (
                                <Event key={index} event={event.id} showPic={members.length > 1} boolEdit={editing} />
                            ))
                        }
                    </div>
                    {
                        isOpen && editing ? <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button style={{ maxWidth: 'fit-content', fontSize: 'small' }} onClick={handleShow}>
                            + {t('addAct')}
                        </Button>
                    </Row> : <></>
                    }

                </Accordion.Body>
            </Accordion.Item>

            <Modal show={show} onHide={handleClose} style={{ border: 'none', borderRadius: '100px' }} centered>
                <Modal.Header closeButton className='border-0' >
                    <Row style={{ width: '100%' }}>
                        <h5 className='mx-auto' style={{ color: "var(--azul)", fontFamily: 'Volkhov', fontWeight: 'bold', textAlign: 'center' }}>{t('addAct')}</h5>
                    </Row>
                </Modal.Header>
                <Modal.Body style={{ minWidth: '100%', padding: '0' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <Col className='d-flex flex-column align-items-center justify-content-center' sm={11} md={11} lg={11} style={{ alignContent: 'center', marginBottom: '15px' }}>
                            <Form.Select onChange={(choice) => setActivityName(choice.target.options[choice.target.selectedIndex].text)} aria-label="Default select example" size='sm' style={{ padding: 8, paddingLeft: 15, backgroundColor: '#EFEFEF', border: 'none', borderRadius: '20px', fontSize: 'small' }}>
                                <option>{t('choose')}</option>
                                {
                                    activities.map((activity, index) => (
                                        <option key={index} value={index}>{activity.name}</option>
                                    ))
                                }
                            </Form.Select>

                            <Form.Group controlId="formTimeInput" style={{ marginTop: '20px', width: 'auto' }}>
                                <Form.Label style={{ fontSize: 'small', textAlign: 'center', display: 'block' }}> {t('selTime')} </Form.Label>
                                <Form.Control
                                    type="time"
                                    value={time}
                                    onChange={handleTimeChange}
                                    required
                                    style={{ fontSize: 'small' }}
                                />
                            </Form.Group>

                            <Button variant="primary" type="button" onClick={handleSave} style={{ marginTop: '35px', backgroundColor: 'var(--naranja)', border: 'none', borderRadius: '30px', fontSize: 'small', width: '40%', fontWeight: '600' }}>
                                {t('save')}
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>

    )
}

function Event(info) {

    const { t } = useTranslation();

    var boolEdit = info.boolEdit ? 'block' : 'none';

    const [event, setEvent] = useState(null);
    const [time, setTime] = useState('');
    const [activity, setActivity] = useState(null);
    const [activities, setActivities] = useState([]);
    const [activityName, setActivityName] = useState('');

    const apiLink = "http://localhost:3000/api/v1/itinerary-activity/" + info.event;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (apiLink) {
                    const response = await fetch(apiLink,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setEvent(data);
                    setTime(data.time);
                    setActivity(data.activity);

                    const response2 = await fetch("http://localhost:3000/api/v1/activity",
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    if (!response2.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data2 = await response2.json();
                    setActivities(data2);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchData();
    }, [apiLink]);

    var userPic = event ? event.addedBy.profilePic : null;

    var showPic = info.showPic ? 'block' : 'none';

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = async () => setShow(true);

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };


    const getActID = (name) => {
        console.log('Name', name);
        for (let i = 0; i < activities.length; i++) {
            console.log(activities[i].name, activities[i].id);
            if (activities[i].name === name) {
                console.log('found');
                return activities[i].id;
            }
        }
        return activity.id;
    }

    const handleSave = () => {
        const updatedEvent = { ...event, time };

        fetch(apiLink, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedEvent),
        })
            .then(async response => {
                let rta = await response.json();
                if (!response.ok) {
                    throw new Error(rta.message);
                }
                return rta;
            })
            .then(async data => {
                setEvent(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert(error.message);
            });

        fetch(apiLink + '/activity/' + getActID(activityName), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(async response => {
            let rta = await response.json();
            console.log('Code', rta);
            if (!response.ok) {
                throw new Error(rta.message);
            }
            setActivity(rta.activity);
            alert('Event updated successfully');
            return rta;
        }).then(async data => {
        }).catch(error => {
            console.error('Fetch error:', error);
            alert(error.message);
        });

        handleClose();
    };


    return (
        event ?
            <>
                <Row style={{ marginTop: '15px' }}>
                    <Col xs={1} md={1} lg={1} style={{ width: '100px' }}>
                        <div className="time">{event.time}</div>
                    </Col>
                    <Col xs={8} md={8} lg={8} style={{ textAlign: "left", color: "var(--azul)" }} >
                        <h6>{activity.name}</h6>
                        {
                            activity.addressess.map((loc, index) => (
                                <Row key={index} style={{ alignItems: 'center' }}>
                                    <Col style={{ maxWidth: 'fit-content', display: 'flex', alignItems: 'center' }}>
                                        <img src={'/pin_icon.svg'} alt="pin" />
                                    </Col>
                                    <Col style={{ display: 'flex', alignItems: 'center', paddingLeft: 0 }}>
                                        <p style={{ margin: 0 }}>{loc}</p>
                                        &nbsp;
                                        <p style={{ margin: 0 }}> - </p>
                                        &nbsp;
                                        <a href={`https://maps.google.com/?q=${loc}`} style={{ fontWeight: 'bold', margin: 0, textDecoration: 'none', color: 'inherit', fontSize: '0.85em' }}> {t('directions')} </a>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Image roundedCircle src={userPic} alt="profile" style={{ width: '30px', height: '30px', display: showPic, objectFit: 'cover', marginTop: '5px' }}></Image>
                    </Col>
                    <Col xs={1} md={1} lg={1} style={{ display: boolEdit, justifyContent: 'flex-end', maxWidth: 'fit-content' }}>
                        <button style={{ marginBottom: 0, background: 'none', border: 'none', display: boolEdit }} onClick={handleShow}>
                            <img src={'/editIcon.svg'} alt="edit" style={{ width: '20px', height: '20px' }} />
                        </button>
                    </Col>


                </Row>

                <Modal show={show} onHide={handleClose} style={{ border: 'none', borderRadius: '100px' }} centered>
                    <Modal.Header closeButton className='border-0' >
                        <Row style={{ width: '100%' }}>
                            <h5 className='mx-auto' style={{ color: "var(--azul)", fontFamily: 'Volkhov', fontWeight: 'bold', textAlign: 'center' }}>{t('editAct')}</h5>
                        </Row>
                    </Modal.Header>
                    <Modal.Body style={{ minWidth: '100%', padding: '0' }}>
                        <Row style={{ display: 'flex', justifyContent: 'center' }}>
                            <Col className='d-flex flex-column align-items-center justify-content-center' sm={11} md={11} lg={11} style={{ alignContent: 'center', marginBottom: '15px' }}>
                                <Form.Select onChange={(choice) => setActivityName(choice.target.options[choice.target.selectedIndex].text)} aria-label="Default select example" size='sm' style={{ padding: 8, paddingLeft: 15, backgroundColor: '#EFEFEF', border: 'none', borderRadius: '20px', fontSize: 'small' }}>
                                    <option>{activity.name}</option>
                                    {
                                        activities.map((activity, index) => (
                                            <option key={index} value={index}>{activity.name}</option>
                                        ))
                                    }
                                </Form.Select>

                                <Form.Group controlId="formTimeInput" style={{ marginTop: '20px', width: 'auto' }}>
                                    <Form.Label style={{ fontSize: 'small', textAlign: 'center', display: 'block' }}> {t('selTime')} </Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={time}
                                        onChange={handleTimeChange}
                                        required
                                        style={{ fontSize: 'small' }}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="button" onClick={handleSave} style={{ marginTop: '35px', backgroundColor: 'var(--naranja)', border: 'none', borderRadius: '30px', fontSize: 'small', width: '40%', fontWeight: '600' }}>
                                    {t('save')}
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>

            </> : <></>
    )
}

const getDaysObject = (itineraryActivities, startDate, endDate) => {

    let days = {};

    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (!days[dateString]) {
            days[dateString] = [];
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    itineraryActivities.forEach(activity => {
        const date = activity.date.split('T')[0];
        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(activity);
    });

    // Sort activities within each day by time
    for (const date in days) {
        days[date].sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });
    }

    return days;
}

function AvatarList(memberList) {
    const members = memberList.memberList.slice(0, 5);

    return (
        <Container style={styles.avatarList}>
            {
                members.map((member, index) => (
                    <Image key={index} roundedCircle src={member.profilePic} alt="profile" style={styles.avatar}></Image>
                ))
            }
            {
                memberList.memberList.length > 1 ? <Image roundedCircle src={'plus.svg'} alt="profile" style={styles.avatar}></Image> : <></>
            }
        </Container>
    );
};


function ItineraryDetail(info) {

    const { t } = useTranslation();
    const itinerary = info.itineraryData;

    const days = getDaysObject(itinerary.itineraryActivities, itinerary.startDate, itinerary.endDate);

    return (
        <Card.Body>
            <Card.Title className='text-center' style={{ marginBottom: '20px' }}>
                <Row>
                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', zIndex: 1, maxWidth: 'fit-content' }}>
                        <button style={{ marginBottom: 0, background: 'none', border: 'none', display: 'block' }} onClick={info.setNull}>
                            <img src={'/arrow.svg'} alt="edit" style={{ width: '30px', height: '30px', transform: 'scaleX(-1)' }} />
                        </button>
                    </Col>
                    <Col className='text-center' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 className='titulo' style={{ color: "var(--azul)", marginBottom: 0, padding: 0 }}>{t('trip2') + itinerary.destination}</h2>
                    </Col>
                </Row>
            </Card.Title>
            <Col className="mb-3" style={{ alignItems: "center", justifyContent: "center" }}>
                {
                    Object.entries(days).map((day, index) => (
                        <Row className="mb-3" style={{ alignItems: "center", justifyContent: "center" }} key={index}>
                            <Accordion defaultActiveKey="1">
                                <Day info={day} users={itinerary.users} itineraryID={itinerary.id}/>
                            </Accordion>
                        </Row>
                    ))
                }
            </Col>
        </Card.Body>


    );
}

function Itinerary(info, itineraryData = null) {

    const apiLink = "http://localhost:3000/api/v1/user/" + localStorage.getItem('userID');

    const [itineraryList, setItineraryList] = useState(null);

    const formatDate = (date) => {
        // 2024-07-15T00:00:00.000Z into 2024-07-15
        return date.split('T')[0];
    }

    const getItineraries = async (itineraryList) => {
        const itineraries = [];
        for (const itinerary of itineraryList) {
            const response = await fetch("http://localhost:3000/api/v1/itinerary/" + itinerary.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            itineraries.push(data);
        }
        setItineraryList(itineraries);  
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (apiLink) {
                    const response = await fetch(apiLink,
                        {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setItineraryList(data.itineraries);
                    getItineraries(data.itineraries);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        fetchData( );

    }, [apiLink]);

    const [itinerary, setItinerary] = useState(null);

    const { t } = useTranslation();

    const setNull = () => {
        console.log('Setting null');
        setItinerary(null);
    }

    return (
        <Container id='contItinerary' className="vh-100 d-flex flex-column align-items-center justify-content-center">
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '65vh' }}>
                <h1 style={{ textAlign: 'center', paddingTop: '0%', fontSize: '5rem' }}>
                    {t('urTrips')}
                </h1>
            </Container>
            <Container className='d-flex justify-content-center' style={{ width: '900px', position: 'relative', paddingBottom: '20px' }}>
                <Card className="backCard" style={{ minWidth: '100%', position: 'absolute', top: 0, }}>
                    {
                        itinerary ? <ItineraryDetail itineraryData={itinerary} setNull={setNull} /> : <Card.Body>
                            <Col className="mb-3" style={{ alignItems: "center", justifyContent: "center" }}>
                                <ListGroup variant='flush' style={{ margin: 5, padding: 0, alignItems: "center", justifyContent: "center" }}>
                                    {
                                        itineraryList && itineraryList.map((itineraryObj, index) => (
                                            <ListGroup.Item key={index} action onClick={() => setItinerary(itineraryObj)} style={{ paddingLeft: 20, color: "var(--azul)", verticalAlign: 'center' }}>
                                                <Row>
                                                    <Col xs={8} md={8} lg={9}>
                                                        <Row>
                                                            <h5 style={{ fontFamily: 'Volkhov', fontWeight: 'bold', paddingTop: 10, marginBottom: 0 }}> {itineraryObj.name} </h5>
                                                        </Row>
                                                        <Row style={{ maxHeight: 'fit-content', marginBottom: 0 }}> <p style={{ maxHeight: 'fit-content', marginBottom: 5, marginTop: 0 }}>{formatDate(itineraryObj.startDate)}</p> </Row>
                                                    </Col>
                                                    <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Col style={{ maxWidth: 'fit-content' }}>
                                                            {
                                                                itineraryObj.users.length > 1 ?<AvatarList memberList={itineraryObj.users} />: <></>
                                                            }
                                                        </Col>
                                                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', maxWidth: 'fit-content', paddingLeft: 20 }}>
                                                            <Image style={{ height: '30px' }} src="/arrow.svg" alt="arrow"></Image>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </ListGroup>
                            </Col>
                        </Card.Body>
                    }
                </Card>
            </Container>
        </Container >
    );
};


export default Itinerary;
