import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Late } from "@/convex/lates";
import { Button, Skeleton, Stack, Typography } from "@mui/joy";
import { useMutation, useQuery } from "convex/react";

export interface LateDisplayProps {
  late: Late;
}

const LateDisplay = ({ late }: LateDisplayProps) => {
  const allDishes = useQuery(api.dishes.getDishesForMeal, {
    mealId: late.mealId,
  });
  const setIsCancelled = useMutation(api.lates.setIsCancelled);
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

  return (
    <Stack gap={1} flex="1">
      <Stack direction="row" gap={1}>
        <Typography fontWeight="bold" my="auto" flex={1}>
          {late.cancelled ? (
            <>
              <s>{late.name}</s> CANCELLED
            </>
          ) : (
            late.name
          )}
        </Typography>
        <Button size="sm" color="neutral" variant="outlined">
          edit
        </Button>
        <Button
          size="sm"
          color="neutral"
          variant="outlined"
          onClick={toggleCancel}
        >
          {late.cancelled ? "uncancel" : "cancel"}
        </Button>
      </Stack>
      <Typography>{late.servingMethod}</Typography>
      <Typography>
        {dishString ? dishString : <Skeleton>Lorem ipsum</Skeleton>}
      </Typography>
      <Typography>{late.description}</Typography>
    </Stack>
  );
};

export default LateDisplay;
