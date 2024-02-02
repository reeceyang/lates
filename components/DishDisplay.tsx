import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Button, Chip, Stack, Typography } from "@mui/joy";
import { useMutation } from "convex/react";
import { useState } from "react";
import DishEditor from "./DishEditor";
import { WithoutSystemFields } from "convex/server";

export interface DishDisplayProps {
  dish: Dish;
  isEditable?: boolean;
}

const DishDisplay = ({ dish, isEditable = false }: DishDisplayProps) => {
  const deleteDish = useMutation(api.dishes.deleteDish);
  const patchDish = useMutation(api.dishes.patch);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (
    updatedDish: Omit<WithoutSystemFields<Dish>, "mealId">
  ) => {
    patchDish({
      dishId: dish._id,
      updatedDish: { ...updatedDish, mealId: dish.mealId },
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return <DishEditor dish={dish} onSave={handleSave} />;
  }

  return (
    <Stack gap={1} flex="1">
      <Stack direction="row" gap={1}>
        <Typography fontWeight="bold" my="auto" flex={1}>
          {dish.name}
        </Typography>
        {isEditable && (
          <>
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              edit
            </Button>
            <Button
              size="sm"
              color="neutral"
              variant="outlined"
              onClick={() => deleteDish({ dishId: dish._id })}
            >
              remove
            </Button>
          </>
        )}
      </Stack>

      {dish.tags.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap">
          {dish.tags.map((tag, i) => (
            <Chip key={i} variant="outlined">
              {tag}
            </Chip>
          ))}
        </Stack>
      )}
      <Typography>{dish.description}</Typography>
    </Stack>
  );
};

export default DishDisplay;
