import AdminMainMenu from "./components/AdminMainMenu";
import UsersPage from "./pages/UsersPage";
import UserPage from "./pages/UserPage";
import messagesEn from "./translations/en.json";
import UserPicker from "./components/pickers/UserPicker";
import EnrolmentOfficerPicker from "./components/pickers/EnrolmentOfficerPicker";
import SubstitutionEnrolmentOfficerPicker from "./components/pickers/SubstitutionEnrolmentOfficerPicker";
import UserRolesPicker from "./components/pickers/UserRolesPicker";
import UserTypesPicker from "./components/pickers/UserTypesPicker";
import reducer from "./reducer";
import { USER_PICKER_PROJECTION } from "./actions";
import HeraSubs from "./pages/HeraSubs";

const ROUTE_ADMIN_USERS = "admin/users";
const ROUTE_ADMIN_USER_OVERVIEW = "admin/users/overview";
const ROUTE_ADMIN_USER_NEW = "admin/users/new";

// Hera menu item
const HERA_SUBS = "admin/hera";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messagesEn }],
  reducers: [{ key: "admin", reducer }],
  "core.Router": [
    { path: ROUTE_ADMIN_USERS, component: UsersPage },
    { path: ROUTE_ADMIN_USER_NEW, component: UserPage },
    {
      path: `${ROUTE_ADMIN_USER_OVERVIEW}/:user_id`,
      component: UserPage,
    },
    { path: HERA_SUBS, component: HeraSubs },
  ],
  "core.MainMenu": [AdminMainMenu],
  refs: [
    { key: "admin.UserPicker", ref: UserPicker },
    { key: "admin.EnrolmentOfficerPicker", ref: EnrolmentOfficerPicker },
    { key: "admin.SubstitutionEnrolmentOfficerPicker", ref: SubstitutionEnrolmentOfficerPicker },
    { key: "admin.UserRolesPicker", ref: UserRolesPicker },
    { key: "admin.UserTypesPicker", ref: UserTypesPicker },
    {
      key: "admin.UserPicker.projection",
      ref: USER_PICKER_PROJECTION,
    },
    { key: "admin.users", ref: ROUTE_ADMIN_USERS },
    { key: "admin.userOverview", ref: ROUTE_ADMIN_USER_OVERVIEW },
    { key: "admin.userNew", ref: ROUTE_ADMIN_USER_NEW },
    { key: "admin.hers", ref: HERA_SUBS },
  ],
  "invoice.SubjectAndThirdpartyPicker": [
    {
      type: "user",
      picker: UserPicker,
      pickerProjection: USER_PICKER_PROJECTION,
    },
  ],
};

export const AdminModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
