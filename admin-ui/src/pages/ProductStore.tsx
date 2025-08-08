import { useState } from 'react'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material'

interface ProductRow {
  id: string
  name: string
  category: string
  subCategory: string
  price: string
  sales: number
  stock: number
  rating: number
}

const demoProducts: ProductRow[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    price: '$129.00',
    sales: 853,
    stock: 42,
    rating: 4.6,
  },
  {
    id: '2',
    name: 'Running Shoes',
    category: 'Fashion',
    subCategory: 'Footwear',
    price: '$89.00',
    sales: 412,
    stock: 120,
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Home',
    subCategory: 'Kitchen',
    price: '$59.00',
    sales: 231,
    stock: 18,
    rating: 4.0,
  },
]

export default function ProductStore() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = selectedIds.size > 0 && selectedIds.size === demoProducts.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < demoProducts.length

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(demoProducts.map((p) => p.id)))
    }
  }

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = demoProducts.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true
    const matchesSubCategory = selectedSubCategory ? p.subCategory === selectedSubCategory : true
    const matchesSearch = search
      ? [p.name, p.category, p.subCategory].some((field) => field.toLowerCase().includes(search.toLowerCase()))
      : true
    return matchesCategory && matchesSubCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">PRODUCT</h1>
          <Button variant="contained" color="primary" className="!rounded-md !px-4 !py-2 !normal-case">
            Add Product
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <FormControl fullWidth size="small">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={selectedCategory}
                label="Category"
                onChange={(e: SelectChangeEvent) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Fashion">Fashion</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="md:col-span-4">
            <FormControl fullWidth size="small">
              <InputLabel id="subcategory-label">Sub Category</InputLabel>
              <Select
                labelId="subcategory-label"
                id="subcategory"
                value={selectedSubCategory}
                label="Sub Category"
                onChange={(e: SelectChangeEvent) => setSelectedSubCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Audio">Audio</MenuItem>
                <MenuItem value="Footwear">Footwear</MenuItem>
                <MenuItem value="Kitchen">Kitchen</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="md:col-span-4">
            <TextField
              fullWidth
              size="small"
              label="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Product Table Section */}
        <div className="mt-6">
          <TableContainer component={Paper} className="!shadow-sm">
            <Table aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={someSelected}
                      checked={allSelected}
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sub Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sales</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} hover selected={selectedIds.has(row.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onChange={() => handleToggleRow(row.id)}
                      />
                    </TableCell>
                    <TableCell className="!font-medium">{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.subCategory}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.sales}</TableCell>
                    <TableCell>{row.stock}</TableCell>
                    <TableCell>{row.rating.toFixed(1)}</TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton size="small" aria-label="view">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label="edit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" aria-label="delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}