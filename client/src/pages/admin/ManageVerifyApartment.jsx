import React from 'react';

import VerifyApartmentTable from '@/components/verify-apartment';

export default function ManageVerifyApartment({ isAdmin }) {
	return <VerifyApartmentTable isAdmin={isAdmin} />;
}
