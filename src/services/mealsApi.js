export async function searchMeals(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data.meals ?? [];
}

export async function getMealById(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data.meals ? data.meals[0] : null;
}

export async function listCategories() {
  const url = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return (data.meals ?? []).map((c) => c.strCategory);
}

export async function filterByCategory(category) {
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data.meals ?? [];
}