import React, { useEffect, useState } from "react";
import { useGraphqlMutation, useGraphqlQuery } from "@openimis/fe-core";
import EnhancedTable from "./HeraTable";

function Overview() {
  const [subscriptions, setSubscriptions] = useState(null);
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

  const mutation = useGraphqlMutation(
    `
    mutation UPDATE_HERA_SUBS(
			$operation: String!, 
			$topic: String!,
			$uuid: String,
		){
      updateHeraSubs(
        operation: $operation
        topic: $topic
      ){
        subs
      }
    }
    `,
  );

  useEffect(() => {
    setSubscriptions(data?.heraSubscriptions);
  }, [data]);

  const handleMutation = async(topic, active, uuid=null) => {
    await mutation({variables: {
      operation: active ? "unsubscribe_from_topic" : "subscribe_to_life_event",
      topic: topic,
      uuid: uuid,
    }})
    refetch();
  };

  return (
    <div>
      <h1>Hera Subscriptions</h1>
      <EnhancedTable subscriptions={subscriptions} handleMutation={handleMutation} />
    </div>
  );
}
export default Overview;
