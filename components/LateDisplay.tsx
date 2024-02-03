import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Late } from "@/convex/lates";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Skeleton,
  Stack,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery } from "convex/react";
import { WithoutSystemFields } from "convex/server";
import { useState } from "react";
import LateEditor from "./LateEditor";
import dayjs from "dayjs";

export interface LateDisplayProps {
  late: Late;
}

const LateDisplay = ({ late }: LateDisplayProps) => {
  const allDishes = useQuery(api.dishes.getDishesForMeal, {
    mealId: late.mealId,
  });
  const setIsCancelled = useMutation(api.lates.setIsCancelled);
  const patchLate = useMutation(api.lates.patch);
  const [isEditing, setIsEditing] = useState(false);

  const onlyIncludedDishes = late.dishIds
    .map((dishId) => allDishes?.find((dish) => dish._id === dishId))
    .filter((dish): dish is Dish => dish !== undefined);
  const excludedDishes = allDishes?.filter(
    (dish) => !late.dishIds.includes(dish._id)
  );
  const dishString = (() => {
    if (excludedDishes) {
      if (excludedDishes.length === 0) {
        return "everything";
      }
      if (onlyIncludedDishes.length === 0) {
        return "nothing";
      }
      const lf = new Intl.ListFormat("en");
      if (excludedDishes?.length > onlyIncludedDishes.length) {
        return `only ${lf.format(onlyIncludedDishes.map((dish) => dish.name))}`;
      } else {
        return `everything except for ${lf.format(
          excludedDishes.map((dish) => dish.name)
        )}`;
      }
    }
    return undefined;
  })();

  const toggleCancel = () => {
    setIsCancelled({
      lateId: late._id,
      cancelled: !late.cancelled,
    });
  };

  const handleSave = (updatedLate: WithoutSystemFields<Late>) => {
    patchLate({
      lateId: late._id,
      updatedLate: { ...updatedLate },
    });
    setIsEditing(false);
  };

  return (
    <>
      <Stack gap={1} flex="1">
        <Stack direction="row" gap={1}>
          <Typography fontWeight="bold" my="auto">
            {late.cancelled ? (
              <>
                CANCELLED <s>{late.name}</s>
              </>
            ) : (
              late.name
            )}
          </Typography>

          {!late.cancelled && (
            <Box m="auto">
              <Chip variant="outlined">{late.servingMethod}</Chip>
            </Box>
          )}
          <Box flex="1" />
          {!late.cancelled && (
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              edit
            </Button>
          )}
          <Button
            size="sm"
            color="neutral"
            variant="outlined"
            onClick={toggleCancel}
          >
            {late.cancelled ? "uncancel" : "cancel"}
          </Button>
        </Stack>
        {!late.cancelled && (
          <>
            <Typography>
              {dishString ? dishString : <Skeleton>Lorem ipsum</Skeleton>}
            </Typography>
            <Typography>{late.description}</Typography>
            <Typography level="body-xs">
              Requested{" "}
              {dayjs(late._creationTime).format("hh:mm a MMM D, YYYY")}
            </Typography>
          </>
        )}
      </Stack>
      <LateEditor
        mealId={late.mealId}
        onSave={handleSave}
        open={isEditing}
        onClose={() => setIsEditing(false)}
        late={late}
      />
    </>
  );
};

export default LateDisplay;
