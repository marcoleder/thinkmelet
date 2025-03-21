"use client";

import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from '@mui/material';
import {useRouter} from 'next/navigation';
import {DASHBOARD_URL} from "@/constants";

const industries = [
    "Agriculture", "Automotive", "Banking", "Biotechnology", "Construction",
    "Consulting", "Consumer Goods", "Cybersecurity", "Education", "Electronics",
    "Energy", "Entertainment", "Financial Services", "Food and Beverage", "Government",
    "Healthcare", "Hospitality", "Insurance", "Legal", "Logistics", "Manufacturing",
    "Marketing", "Media", "Non-profit", "Pharmaceuticals", "Real Estate", "Retail",
    "Software", "Telecommunications", "Transportation", "Utilities", "Tourism",
    "Handicrafts", "Textile Industry", "Watchmaking", "Precision Engineering",
    "Local Cafés", "Bakeries", "Butchers", "Florists", "Bookstores",
    "Graphic Design", "Web Development", "Freelance Consulting", "Wellness & Spa",
    "Fitness & Personal Training", "Yoga Studios", "Physiotherapy", "Chiropractic",
    "Hair Salons", "Beauty Salons", "Tattoo Studios", "Carpentry", "Plumbing",
    "Electricians", "Roofing Services", "Home Cleaning Services", "Landscaping",
    "Auto Repair Shops", "Bike Shops", "Wine Shops", "Cheese Production",
    "Chocolate Making", "Art Galleries", "Antique Shops", "Photography Studios",
    "Event Planning", "Catering Services", "Bed and Breakfasts", "Hostels",
    "Farm-to-Table Restaurants", "Microbreweries", "Organic Farming",
    "Sustainable Fashion", "Second-hand Clothing Stores", "Ski and Outdoor Equipment Shops",
    "Local Artisans", "Printing Services", "Translation Services", "Legal Advisory",
    "Tax Consulting", "Financial Advisory", "Import & Export Businesses", "Trade & Wholesale",
    "Medical Practices", "Dental Clinics", "Homeopathy", "Opticians", "Childcare Services",
    "Private Tutoring", "Music Schools", "Driving Schools", "Custom Tailoring", "Jewelry Design",
    "Handmade Leather Goods", "Interior Design", "Architecture Firms", "Pet Grooming",
    "Veterinary Services", "Small IT Support Businesses", "Sustainable Energy Consulting"
];

const companySizes = [
    '1-10 Employees',
    '10-100 Employees',
    '100-1000 Employees',
    '1000-10\'000 Employees',
    '10\'000-100\'000 Employees',
    '>100\'000 Employees'
];
const revenueRanges = ['<$1M', '$1M-$10M', '$10M-$100M', '>$100M'];
const profitabilityStatuses = ['Profitable', 'Break-even', 'Loss-making'];
const marketPositions = ['Market Leader', 'Challenger', 'Niche Player', 'Struggling'];
const competitiveLandscapes = ['High Competition', 'Low Competition', 'Monopoly'];
const keyChallengesOptions = [
    'Declining Sales', 'High Costs', 'Supply Chain Issues', 'Talent Retention',
    'Regulatory Compliance', 'Digital Transformation', 'Customer Satisfaction',
    'Operational Efficiency', 'Market Saturation', 'Cash Flow Problems'
];
const customerBases = ['B2B', 'B2C', 'Mixed', 'Government'];
const geographicalPresences = ['Local', 'Regional', 'National', 'International', 'Global'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function CompanyForm() {
    const router = useRouter();

    const [industry, setIndustry] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [revenueRange, setRevenueRange] = useState('');
    const [profitabilityStatus, setProfitabilityStatus] = useState('');
    const [marketPosition, setMarketPosition] = useState('');
    const [competitiveLandscape, setCompetitiveLandscape] = useState('');
    const [keyChallenges, setKeyChallenges] = useState([]);
    const [customerBase, setCustomerBase] = useState('');
    const [geographicalPresence, setGeographicalPresence] = useState('');

    const handleRedirect = () => {
        router.push(DASHBOARD_URL);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom sx={{ mt: 1 }}>
                Company Analysis Form
            </Typography>
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2}>
                    {/* Industry */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Industry</InputLabel>
                            <Select
                                value={industry}
                                label="Industry"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setIndustry(value);
                                    localStorage.setItem("companySize", value);
                                }}
                            >
                                {industries.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Company Size */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Company Size</InputLabel>
                            <Select
                                value={companySize}
                                label="Company Size"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCompanySize(value)
                                    localStorage.setItem("companySize", value);
                                }}
                            >
                                {companySizes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Revenue Range */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Revenue Range</InputLabel>
                            <Select
                                value={revenueRange}
                                label="Revenue Range"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setRevenueRange(value);
                                    localStorage.setItem("revenueRange", value);
                                }}
                            >
                                {revenueRanges.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Profitability Status */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Profitability Status</InputLabel>
                            <Select
                                value={profitabilityStatus}
                                label="Profitability Status"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setProfitabilityStatus(value);
                                    localStorage.setItem("profitabilityStatus", value);
                                }}
                            >
                                {profitabilityStatuses.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Market Position */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Market Position</InputLabel>
                            <Select
                                value={marketPosition}
                                label="Market Position"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMarketPosition(value);
                                    localStorage.setItem("marketPosition", value);
                                }}
                            >
                                {marketPositions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Competitive Landscape */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Competitive Landscape</InputLabel>
                            <Select
                                value={competitiveLandscape}
                                label="Competitive Landscape"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCompetitiveLandscape(value);
                                    localStorage.setItem("competitiveLandscape", value);
                                }}
                            >
                                {competitiveLandscapes.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Key Challenges */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Key Challenges</InputLabel>
                            <Select
                                multiple
                                value={keyChallenges}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setKeyChallenges(value);
                                    localStorage.setItem("keyChallenges", value);
                                }}
                                input={<OutlinedInput label="Key Challenges" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {keyChallengesOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox checked={keyChallenges.indexOf(option) > -1} />
                                        <ListItemText primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Customer Base */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Customer Base</InputLabel>
                            <Select
                                value={customerBase}
                                label="Customer Base"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCustomerBase(value);
                                    localStorage.setItem("customerBase", value);
                                }}
                            >
                                {customerBases.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Geographical Presence */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Geographical Presence</InputLabel>
                            <Select
                                value={geographicalPresence}
                                label="Geographical Presence"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGeographicalPresence(value);
                                    localStorage.setItem("geographicalPresence", value);
                                }}
                            >
                                {geographicalPresences.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box align="right">
                    <Button
                        variant="contained"
                        sx={{ my: 2, mx: 3 }}
                        onClick={handleRedirect}
                    >
                        I answered enough
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}