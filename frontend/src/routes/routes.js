//Config
import config from '@/config';
//Layout
import { HeaderOnly } from '@/layouts';
//Pages
import Home from '@/pages/Home';
import Following from '@/pages/Following';
import Profile from '@/pages/Profile';
import ManagerAccount from '@/pages/ManagerAccount';
import MedicalChecklist from '@/pages/MedicalChecklist';
import ManageBill from '@/pages/ManageBill';
import ManageDrugBook from '@/pages/ManageDrugBook';
import ManageDrug from '@/pages/ManageDrug';
import SpecialistChecklist from '@/pages/SpecialistChecklist';
import DetailInformation from '@/pages/DetailInformation';
import Login from '@/pages/Login';
import Report from '@/pages/Return-report';
import ProfileAccount from '@/pages/ProfileAccount';

const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.following,
        component: Following,
    },
    {
        // jobs: ['Manager'],
        path: config.routes.managerAccount,
        component: ManagerAccount,
    },
    {
        path: config.routes.profile,
        component: Profile,
    },
    {
        path: config.routes.medicalChecklist,
        component: MedicalChecklist,
    },
    {
        path: config.routes.specialistChecklist,
        component: SpecialistChecklist,
    },
    {
        path: config.routes.detailInformation,
        component: DetailInformation,
        layout: HeaderOnly,
    },
    {
        path: config.routes.manageBill,
        component: ManageBill,
    },
    {
        path: config.routes.manageDrugBook,
        component: ManageDrugBook,
    },
    {
        path: config.routes.manageDrug,
        component: ManageDrug,
    },
    {
        path: config.routes.login,
        component: Login,
        layout: null,
    },

    {
        path: config.routes.report,
        component: Report,
    },
    {
        path: config.routes.profileAccount,
        component: ProfileAccount,
        layout: HeaderOnly,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
