import { api } from "@/convex/_generated/api";
import { Dish } from "@/convex/dishes";
import { Button, Chip, Stack, Typography } from "@mui/joy";
import { useMutation } from "convex/react";
import { useState } from "react";

export interface DishDisplayProps {
  dish: Dish;
  isEditable?: boolean;
}

const DishDisplay = ({ dish, isEditable = false }: DishDisplayProps) => {
  const deleteDish = useMutation(api.dishes.deleteDish);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Stack gap={1} flex="1">
      <Stack direction="row" gap={1}>
        <Typography fontWeight="bold" my="auto" flex={1}>
          {dish.name}
        </Typography>
        {isEditable && (
          <>
            <Button size="sm" color="neutral" variant="outlined">
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

      <Stack direction="row" gap={1} flexWrap="wrap">
        {dish.tags.map((tag, i) => (
          <Chip key={i} variant="outlined">
            {tag}
          </Chip>
        ))}
      </Stack>
      <Typography>{dish.description}</Typography>
    </Stack>
  );
};

export default DishDisplay;
