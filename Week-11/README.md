# Dimensionality Reduction using PCA and t-SNE

This project demonstrates **Dimensionality Reduction** using two popular techniques:

* **Principal Component Analysis (PCA)**
* **t-Distributed Stochastic Neighbor Embedding (t-SNE)**

The project uses the **MNIST Handwritten Digits** dataset, where each image is 28 × 28 pixels, resulting in **784 features per image**.

The main objective is to understand how high-dimensional data can be transformed into a lower-dimensional representation for visualization and analysis.

---

## Dataset

**Dataset:** MNIST Handwritten Digits

**Source:** Kaggle – MNIST Handwritten Digits

The dataset contains:

* 60,000 training images
* 10,000 testing images
* Image size: 28 × 28 pixels
* Number of features after flattening: 784
* Classes: Digits 0–9

The dataset files used in the project are:

* `train_images.npy`
* `train_labels.npy`
* `test_images.npy`
* `test_labels.npy`

---

# Part 1 — Principal Component Analysis (PCA)

## Objective

The first part of the project demonstrates **Principal Component Analysis (PCA)** for reducing the dimensionality of MNIST images.

Each image originally contains:

**28 × 28 = 784 features**

PCA transforms these 784-dimensional images into a lower-dimensional representation while retaining the directions containing the maximum variance.

## Steps Performed

1. Loaded the MNIST dataset.
2. Visualized sample handwritten digit images.
3. Flattened each 28 × 28 image into a 784-dimensional vector.
4. Scaled pixel values from the range 0–255 to 0–1.
5. Applied PCA with 2 principal components.
6. Transformed the 784-dimensional data into 2 dimensions.
7. Visualized the resulting data using a scatter plot.
8. Calculated the explained variance of the principal components.
9. Generated a cumulative explained variance plot.

## PCA Result

The PCA visualization represents each MNIST image as a point in a 2-dimensional space.

Different colors represent different digit classes from **0 to 9**.

PCA provides a fast and interpretable way to reduce the dimensionality of the dataset and visualize its overall structure.

---

# Part 2 — t-SNE

## Objective

The second part demonstrates **t-Distributed Stochastic Neighbor Embedding (t-SNE)** for visualizing high-dimensional MNIST data.

Unlike PCA, t-SNE is a **non-linear dimensionality reduction technique** that focuses mainly on preserving local relationships between data points.

## Steps Performed

1. Selected 10,000 MNIST training samples for faster computation.
2. Used the scaled 784-dimensional image data as input.
3. Applied t-SNE with 2 output dimensions.
4. Used a perplexity value of 30.
5. Set a fixed random state for reproducibility.
6. Visualized the resulting 2-dimensional representation.
7. Used different colors to represent the digit labels.

## t-SNE Result

The t-SNE visualization represents the handwritten digits in a 2-dimensional space.

Similar images tend to appear closer together, allowing groups and local patterns within the dataset to be visually explored.

t-SNE is particularly useful for **exploratory data analysis and visualizing clusters in high-dimensional datasets**.

---

# PCA vs t-SNE

| Aspect           | PCA                                       | t-SNE                             |
| ---------------- | ----------------------------------------- | --------------------------------- |
| Type             | Linear                                    | Non-linear                        |
| Main purpose     | Dimensionality reduction                  | Visualization                     |
| Focus            | Maximum variance                          | Local relationships               |
| Speed            | Faster                                    | Slower                            |
| Interpretability | Higher                                    | Lower                             |
| Typical use      | Compression, preprocessing, visualization | Cluster and pattern visualization |

---

# Technologies Used

* Python
* NumPy
* Pandas
* Matplotlib
* Seaborn
* Scikit-learn
* Kaggle Notebook

---

# Project Workflow

```text
MNIST Dataset
      ↓
Load Images
      ↓
28 × 28 Images
      ↓
Flatten Images
      ↓
784 Features
      ↓
Scale Pixel Values
      ↓
 ┌───────────────┐
 │               │
 ▼               ▼
 PCA            t-SNE
 │               │
 ▼               ▼
2D Output      2D Output
 │               │
 └───────┬───────┘
         ▼
   Visualization
```



# Conclusion

This project demonstrates how dimensionality reduction can be used to simplify and visualize high-dimensional data.

**PCA** provides a fast linear approach that captures directions of maximum variance, while **t-SNE** provides a non-linear approach that is particularly useful for exploring local similarities and patterns.

Using MNIST, the project demonstrates the transformation of **784-dimensional image data into a 2-dimensional representation**, making the structure of the dataset easier to visualize and analyze.
