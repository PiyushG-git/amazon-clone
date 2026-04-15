import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ marginTop: 'auto', backgroundColor: '#232f3e', color: 'white' }}>
            <div 
                style={{ backgroundColor: '#37475a', padding: '15px 0', textAlign: 'center', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                Back to top
            </div>
            
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '40px 20px' }}>
                <div style={{ padding: '10px 0', minWidth: '150px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Get to Know Us</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Careers</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Blog</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>About Amazon</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Investor Relations</a></li>
                    </ul>
                </div>

                <div style={{ padding: '10px 0', minWidth: '150px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Make Money with Us</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Sell products on Amazon</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Sell on Amazon Business</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Become an Affiliate</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Advertise Your Products</a></li>
                    </ul>
                </div>

                <div style={{ padding: '10px 0', minWidth: '150px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Amazon Payment Products</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Amazon Business Card</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Shop with Points</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Reload Your Balance</a></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Amazon Currency Converter</a></li>
                    </ul>
                </div>

                <div style={{ padding: '10px 0', minWidth: '150px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Let Us Help You</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '2' }}>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Amazon and COVID-19</a></li>
                        <li><Link to="/orders" style={{ color: '#dddddd', textDecoration: 'none' }}>Your Account</Link></li>
                        <li><Link to="/orders" style={{ color: '#dddddd', textDecoration: 'none' }}>Your Orders</Link></li>
                        <li><a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Help</a></li>
                    </ul>
                </div>
            </div>

            <div style={{ backgroundColor: '#131921', padding: '30px 0', textAlign: 'center', fontSize: '12px', color: '#dddddd', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Conditions of Use</a>
                    <a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Privacy Notice</a>
                    <a href="#" style={{ color: '#dddddd', textDecoration: 'none' }}>Consumer Health Data Privacy Disclosure</a>
                </div>
                <span>© 1996-2024, Amazon.com, Inc. or its affiliates</span>
            </div>
        </footer>
    );
};

export default Footer;
