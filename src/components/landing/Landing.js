import './Landing.css';
import '../../index.css';
import { Row, Col, Button, Form, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Headline = () => {
    const { t } = useTranslation();
    return (
        <>
            <img src="/vectorLanding.svg" alt="Vector" />
            <h1 className="fs-1 fs-md-1" style={{ maxWidth: '650px' }}>{t('Motto')}</h1>
        </>
    );
};

const Formulario = () => {
    const { t } = useTranslation();
    return (
        <div id="test">
            <Form>
                <Row className="g-3">
                    <Col xs={12} md>
                        <Form.Control
                            type="text"
                            id="destination"
                            placeholder={t('destination')}
                        />
                    </Col>
                    <Col xs={12} md>
                        <Form.Select aria-label={t('TravelType')}>
                            <option aria-label={t('TravelType')}>{t('TravelType')}</option>
                            <option value="1" aria-label={t('business')}>{t('business')}</option>
                            <option value="2" aria-label={t('pleasure')}>{t('pleasure')}</option>
                            <option value="3" aria-label={t('family')}>{t('family')}</option>
                            <option value="4" aria-label={t('friends')}>{t('friends')}</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md>
                        <Form.Select aria-label={t('Duration')}>
                            <option aria-label={t('Duration')}>{t('Duration')}</option>
                            <option value="1" aria-label={`1-3 ${t('Days')}`}>1-3 {t('Days')}</option>
                            <option value="2" aria-label={`4-7 ${t('Days')}`}>4-7 {t('Days')}</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} md>
                        <Button className='btn-primary' variant="primary" type="submit" id="Submit">
                            {t('Send')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

function Landing() {
    return (
        <Container id='contLanding' className="vh-100">
            <Container className="headline">
                <Headline />
                <Formulario />
            </Container>
        </Container>
    );
}

export default Landing;
