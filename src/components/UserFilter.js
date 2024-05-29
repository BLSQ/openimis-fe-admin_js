import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Checkbox, FormControlLabel, } from "@material-ui/core";
import { withModulesManager, decodeId, PublishedComponent, ControlledField, TextInput, formatMessage } from "@openimis/fe-core";

const styles = (theme) => ({
  dialogTitle: theme.dialog.title,
  dialogContent: theme.dialog.content,
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
  paperDivider: theme.paper.divider,
});

const extractLocations = (locations) => {
  const locationsArray = Object.values(locations).map((l) => l.value);
  const region = locationsArray.find((l) => !l.parent);
  const district = region && locationsArray.find((l) => l.parent && l.parent.id === region.id);
  const municipality = district && locationsArray.find((l) => l.parent && l.parent.id === district.id);
  const village = municipality && locationsArray.find((l) => l.parent && l.parent.id === municipality.id);

  return { region, district, municipality, village };
};

const getParentLocation = (locations) => {
  const extractedLocations = extractLocations(locations);
  const { region, district, municipality, village } = extractedLocations;
  if (!region) {
    return null;
  }
  let newLocation = {
    key: "regionId",
    id: decodeId(region.id),
    value: region,
  };
  if (district) {
    newLocation = {
      key: "districtId",
      id: decodeId(district.id),
      value: district,
    };
  }
  if (municipality) {
    newLocation = {
      key: "municipalityId",
      id: decodeId(municipality.id),
      value: municipality,
    };
  }
  if (village) {
    newLocation = {
      key: "villageId",
      id: decodeId(village.id),
      value: village,
    };
  }
  return newLocation;
};

class UserFilter extends Component {
  state = {
    currentUserType: undefined,
    currentUserRoles: undefined,
    locationFilters: {},
    selectedDistrict: {},
    showHistory: false,
  };

  debouncedOnChangeFilter = _debounce(
    this.props.onChangeFilters,
    this.props.modulesManager.getConf("fe-admin", "debounceTime", 800),
  );

  filterValue = (k) => {
    const { filters } = this.props;
    return !!filters && !!filters[k] ? filters[k].value : null;
  };

  filterDistrict = (locations) => {
    const extractedLocations = extractLocations(locations);
    const { district } = extractedLocations;

    return district;
  };

  onChangeShowHistory = () => {
    const filters = [
      {
        id: "showHistory",
        value: !this.state.showHistory,
        filter: `showHistory: ${!this.state.showHistory}`,
      },
    ];
    this.props.onChangeFilters(filters);
    this.setState((state) => ({
      showHistory: !state.showHistory,
    }));
  };

  onChangeUserTypes = (currentUserType) => {
    const { onChangeFilters } = this.props;
    this.setState({ currentUserType });
    onChangeFilters([
      {
        id: "userTypes",
        value: currentUserType,
        filter: currentUserType ? `userTypes: [${currentUserType}]` : null,
      },
    ]);
  };

  onChangeUserRoles = (currentUserRoles) => {
    const { onChangeFilters } = this.props;
    this.setState({ currentUserRoles });
    onChangeFilters([
      {
        id: "roles",
        value: currentUserRoles,
        filter: currentUserRoles ? `roles: [${currentUserRoles.map((ur) => decodeId(ur.id)).join(",")}]` : null,
      },
    ]);
  };

  onChangeLocation = (newLocationFilters) => {
    const { onChangeFilters } = this.props;
    const locationFilters = { ...this.state.locationFilters };
    newLocationFilters.forEach((filter) => {
      if (filter.value === null) {
        delete locationFilters[filter.id];
      } else {
        locationFilters[filter.id] = {
          value: filter.value,
          filter: filter.filter,
        };
      }
    });
    const selectedDistrict = this.filterDistrict(locationFilters);
    this.setState({ locationFilters, selectedDistrict });
    const parentLocation = getParentLocation(locationFilters);
    const filters = [
      {
        id: "parentLocation",
        filter: parentLocation && `${parentLocation.key}: ${parentLocation.id}`,
      },
    ];
    onChangeFilters(filters);
  };

  render() {
    const { classes, onChangeFilters, intl} = this.props;
    const { locationFilters, currentUserType, currentUserRoles, selectedDistrict } = this.state;
    return (
      <section className={classes.form}>
        <Grid container>
          {/*<ControlledField*/}
          {/*  module="admin"*/}
          {/*  id="userFilter.userTypes"*/}
          {/*  field={*/}
          {/*    <Grid item xs={3} className={classes.item}>*/}
          {/*      <PublishedComponent*/}
          {/*        pubRef="admin.UserTypesPicker"*/}
          {/*        value={currentUserType}*/}
          {/*        onChange={(v) => this.onChangeUserTypes(v)}*/}
          {/*      />*/}
          {/*    </Grid>*/}
          {/*  }*/}
          {/*/>*/}
          <ControlledField
            module="admin"
            id="userFilter.userRoles"
            field={
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="admin.UserRolesPicker"
                  value={currentUserRoles}
                  onChange={(v) => this.onChangeUserRoles(v)}
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.healthFacility"
            field={
              <Grid item xs={3} className={classes.item}>
                <PublishedComponent
                  pubRef="location.HealthFacilityPicker"
                  withNull={true}
                  value={this.filterValue("healthFacilityId") || ""}
                  district={selectedDistrict}
                  onChange={(v) => {
                    onChangeFilters([
                      {
                        id: "healthFacility",
                        value: v,
                        filter: v ? `healthFacilityId: ${decodeId(v.id)}` : null,
                      },
                    ]);
                  }}
                />
              </Grid>
            }
          />
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <PublishedComponent
              pubRef="location.DetailedLocationFilter"
              withNull={true}
              filters={locationFilters}
              onChangeFilters={this.onChangeLocation}
              anchor="parentLocation"
            />
          </Grid>
        </Grid>
        <Grid container>
          <ControlledField
            module="admin"
            id="userFilter.username"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.username"
                  name="username"
                  value={this.filterValue("username")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "username",
                        value: v,
                        filter: `username_Icontains: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.LastName"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.lastName"
                  name="lastName"
                  value={this.filterValue("lastName")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "lastName",
                        value: v,
                        filter: `lastName: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.OtherNames"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.otherNames"
                  name="otherNames"
                  value={this.filterValue("otherNames")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "otherNames",
                        value: v,
                        filter: `otherNames: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="userFilter.Email"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.email"
                  name="email"
                  value={this.filterValue("email")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "email",
                        value: v,
                        filter: `email: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
        </Grid>
        <Grid container>
          <ControlledField
            module="admin"
            id="userFilter.Phone"
            field={
              <Grid item xs={3} className={classes.item}>
                <TextInput
                  module="user"
                  label="admin.user.phone"
                  name="phone"
                  value={this.filterValue("phone")}
                  onChange={(v) =>
                    this.debouncedOnChangeFilter([
                      {
                        id: "phone",
                        value: v,
                        filter: `phone: "${v}"`,
                      },
                    ])
                  }
                />
              </Grid>
            }
          />
          <ControlledField
            module="admin"
            id="UserFilter.dob"
            field={
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={6} className={classes.item}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={this.filterValue("dobFrom")}
                      module="user"
                      label="admin.user.dobFrom"
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: "dobFrom",
                            value: d,
                            filter: `birthDateFrom: "${d}"`,
                          },
                        ])
                      }
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.item}>
                    <PublishedComponent
                      pubRef="core.DatePicker"
                      value={this.filterValue("dobTo")}
                      module="user"
                      label="admin.user.dobTo"
                      onChange={(d) =>
                        onChangeFilters([
                          {
                            id: "dobTo",
                            value: d,
                            filter: `birthDateTo: "${d}"`,
                          },
                        ])
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            }
          />
          <ControlledField
            module="policy"
            id="PolicyFilter.showHistory"
            field={
              <Grid item xs={2} className={classes.item}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={this.state.showHistory}
                      onChange={(e) => this.onChangeShowHistory()}
                    />
                  }
                  label={formatMessage(
                    intl,
                    "admin",
                    "UserFilter.showHistory"
                  )}
                />
              </Grid>
            }
          />
        </Grid>
      </section>
    );
  }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(UserFilter))));
