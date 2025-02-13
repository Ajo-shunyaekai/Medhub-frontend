import React from 'react';
import {Page, Text,View,Document,StyleSheet,Image,PDFViewer,Font} from '@react-pdf/renderer';
import moment from 'moment';
 
Font.register({
    family: 'Poppins',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecnFHGPezSQ.woff2', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2', fontWeight: 'bold' }
    ]
});
const styles = StyleSheet.create({
    textContainer: { flexDirection: 'column' },
    leftTextContainer: { width: '50%', alignItems: 'flex-start' },
    rightTextContainer: { width: '50%', alignItems: 'flex-end' },
    page: { padding: 30, backgroundColor: '#ffffff', fontFamily: 'Poppins', },
    container: { padding: 20, backgroundColor: '#ffffff', borderRadius: 10, border: '1px solid #99A0AC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, },
    leftSection: { width: '50%', alignItems: 'flex-start' },
    rightSection: { width: '50%', alignItems: 'flex-end' },
    leftAlign: { textAlign: 'left' },
    rightAlign: { textAlign: 'right' },
    logo: { width: 150, paddingBottom: 12, },
    title: { fontSize: 22,  color: '#282f86', paddingBottom: 10, },
    titleText: { fontSize: 12, color: '#5e676f' },
    infoText: { fontSize: 12, color: '#5e676f', paddingBottom: 10, },
    table: { display: 'table', width: '100%', },
    row: { flexDirection: 'row', borderBottom: '1px solid #99A0AC', backgroundColor: '#FFFFFF', },
    rowHead: { flexDirection: 'row', backgroundColor: '#FFFFFF', },
    cellHeader: { flex: 1, fontSize: 13,  padding: 12, backgroundColor: '#e1f2ff', color: '#333', },
    cell: { flex: 1, fontSize: 12, padding: 12, color: '#5e676f', }
});
 
const InvoicePDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.container}>
                <Image src={require('../assest/navibluelogo.png')} style={styles.logo} />
                <View style={styles.header}>
                    <View style={styles.leftSection}>
                        <Text style={styles.infoText}>D55-PBU,</Text>
                        <Text style={styles.infoText}>Dubai Production City,</Text>
                        <Text style={styles.infoText}>United Arab Emirates</Text>
                        <Text style={styles.infoText}>+971 54279 6424</Text>
                    </View>
                    <View style={styles.rightSection}>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={styles.titleText}>Payment ID: PAY12344</Text>
                    </View>
                </View>
                <View style={styles.header}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.infoText}>Bill To:</Text>
                        <Text style={styles.infoText}>Shivanshi Tripathi</Text>
                    </View>
                    <View style={styles.rightTextContainer}>
                        <Text style={styles.infoText}>Invoice Date: {moment().format('DD/MM/YYYY')}</Text>
                        <Text style={styles.infoText}>Invoice No.: 789654789</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.rowHead}>
                        <Text style={[styles.cellHeader, styles.leftAlign]}>Items Ordered</Text>
                        <Text style={[styles.cellHeader, styles.rightAlign]}>Price</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, styles.leftAlign]}>Medhub Membership</Text>
                        <Text style={[styles.cell, styles.rightAlign]}>50</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, styles.leftAlign]}>Total Amount:</Text>
                        <Text style={[styles.cell, styles.rightAlign]}>124242.441</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document >
);
 
const Invoice = () => {
    return (
        <PDFViewer style={{ width: '100%', height: '100vh' }}>
            <InvoicePDF />
        </PDFViewer>
    );
};
 
export default Invoice;