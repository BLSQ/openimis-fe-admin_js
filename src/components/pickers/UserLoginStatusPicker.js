import React from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { USER_LOGIN_STATUSES } from "../../constants";

// converting true & false to strings because the openIMIS generic components do not properly handle "false" (handled as null or undefined).
// this allows to work without updating these components and breaking the other places where they are used
const convertBoolToYesNo = (value) => {
  if (value === null) {
    return null;
  }
  if (value === true) {
    return "yes";
  }
  return "no";
}

const convertYesNoToBool = (value) => {
  if (value === null) {
    return null;
  }
  if (value === "yes") {
    return true;
  }
  return false;
}

function UserLoginStatusPicker(props) {
  const {
    required, withNull, readOnly, onChange, value, nullLabel, withLabel,
  } = props;
  return (
    <ConstantBasedPicker
      module="admin"
      label="user.loginStatusPicker"
      constants={USER_LOGIN_STATUSES}
      required={required}
      withNull={withNull}
      readOnly={readOnly}
      onChange={(v) => onChange(convertYesNoToBool(v))}
      value={convertBoolToYesNo(value)}
      nullLabel={nullLabel}
      withLabel={withLabel}
    />
  );
}

export default UserLoginStatusPicker;
