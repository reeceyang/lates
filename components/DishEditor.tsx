import { DietTags, Dish } from "@/convex/dishes";
import { Add, MoreHoriz, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  IconButton,
  Input,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useState } from "react";

export interface DishEditorProps {
  dish: Partial<Dish>;
  onSave: (dish: Omit<Dish, "mealId">) => void;
  isNew?: boolean;
}

const DishEditor = ({ dish, onSave, isNew = false }: DishEditorProps) => {
  const [name, setName] = useState(dish.name ?? "");
  const [description, setDescription] = useState(dish.description ?? "");
  const [tags, setTags] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  const handleSave = () => {
    if (name !== "") {
      onSave({ name, tags, description });
      setName("");
      setDescription("");
      setTags([]);
      setShowMore(false);
    }
  };

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1}>
        <Input
          fullWidth
          size="md"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleSave();
            }
          }}
          placeholder="name of your dish"
        />
        <IconButton
          onClick={() => setShowMore((prevValue) => !prevValue)}
          variant="outlined"
        >
          <MoreHoriz />
        </IconButton>

        <Button
          startDecorator={isNew ? <Add /> : <Save />}
          onClick={handleSave}
        >
          {isNew ? "Add" : "Save"}
        </Button>
      </Stack>
      {showMore && (
        <>
          <Stack direction="row" gap={1}>
            <Typography m="auto">Tags:</Typography>
            <Autocomplete
              options={[...Object.values(DietTags)]}
              value={tags}
              onChange={(_event, newValue) => setTags(newValue)}
              multiple
              freeSolo
              sx={{ flex: 1 }}
            />
          </Stack>
          <Textarea
            size="md"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="(optional) description: special notes, ingredients, allergens, etc."
          />
        </>
      )}
    </Stack>
  );
};

export default DishEditor;
