import React, { useEffect, useState } from "react";
import { useGraphqlMutation, useGraphqlQuery } from "@openimis/fe-core";
import EnhancedTable from "./HeraTable";
// import {useUpdateHeraSubsMutation, useQueryHeraSubs} from "./HeraMutation";

function useUpdateHeraSubsMutation (){
  const mutation = useGraphqlMutation(
    `
    mutation UpdateHeraSubsMutation($input: UpdateHeraSubsMutationInput!) {
      updateHeraSubs(input: $input) {
        internalId  
        clientMutationId
      }
    }
    `,
    { onSuccess: (data) => data?.updateHeraSubs }
  );

  return mutation;
}

function useQueryHeraSubs (){
const { data, refetch } = useGraphqlQuery(
  `
  query HERA_SUBS{
    heraSubscriptions{
      topic
      uuid
      active
      address
      policy
    }
  }
  `,
);

return {data, refetch};
}

function Overview() {
  const [subscriptions, setSubscriptions] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const { data, refetch } = useQueryHeraSubs();
  const { mutate } = useUpdateHeraSubsMutation();
  const handleMutation = async(topic, active, uuid=null) => {
    const operation = active ? "unsubscribe_from_topic" : "subscribe_to_life_event";
    try {
      await mutate({topic, operation, uuid});
      refetch();
    } catch (error) {
      setMutationError(error.message);
      console.error(error); // handle the error as needed
    }
  };


  useEffect(() => {
    setSubscriptions(data?.heraSubscriptions);
  }, [data]);

  return (
    <div>
      <h1>Hera Subscriptions</h1>
      {mutationError && <h4 style={{color: "red"}}>{mutationError}</h4>}
      <EnhancedTable subscriptions={subscriptions} handleMutation={handleMutation} />
    </div>
  );
}
// export default Overview;
export { Overview, useQueryHeraSubs, useUpdateHeraSubsMutation };
